
<template>
  <app-md v-if="type == 'header'" :class="customClass">
    <h1><slot /></h1>
  </app-md>
  <app-md v-else-if="type == 'block'" :class="customClass">
    <p><slot /></p>
  </app-md>
  <app-md
    v-else
    :simple="!noMD"
    :class="[
      'ux-text',
      customClass,
      { '--block': isSpanBlock}
    ]"
  >
    <slot />
  </app-md>
</template>


<script lang='ts'>
import './styles/ux-text.css';
import { defineComponent } from "vue";
import AppMarkdownVue from "./AppMarkdown.vue";

const _textType = ['text', 'block', 'header', 'span-block', 'link'];

export default defineComponent({
  components: { 'app-md': AppMarkdownVue },
  props: {
    type:  { type: String, default: 'text' },
    noMD:  { type: Boolean, default: false  },
    class: { type: String, default: ''     },
  },
  setup(props) {
    const { type } = props;
    if (!_textType.includes(type))
      throw Error(`ee-text:: Invalid type ${type} `)
    ;

    const isSpanBlock = type == 'span-block';

    return {
      customClass: props.class,
      isSpanBlock,
    };
  }
});

</script>
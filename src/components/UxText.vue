
<template>
  <app-markdown
    v-if="type == 'header'"
    :header="true"
    :class="customClass"
  >
    <h1><slot /></h1>
  </app-markdown>
  <app-markdown v-else-if="type == 'block'" :class="customClass">
    <p><slot /></p>
  </app-markdown>
  <app-markdown
    v-else
    :class="[
      'ux-text',
      customClass,
      { '--block': isSpanBlock }
    ]"
  >
    <slot />
  </app-markdown>
</template>





<script lang='ts' setup>
import { defineProps } from "vue";
import AppMarkdown from "./AppMarkdown.vue";


const props       = defineProps({
  type:  { type: String,  default: 'text' },
  class: { type: String,  default: ''     },
});
const textType    = ['text', 'block', 'header', 'span-block', 'link'];
const isSpanBlock = props.type == 'span-block';
const customClass = props.class;

if (!textType.includes(props.type))
  throw Error(`ee-text:: Invalid type ${props.type} `)
;

</script>
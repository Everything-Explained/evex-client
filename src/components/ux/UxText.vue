<script lang="ts" setup>
import AppMarkdown from '@/components/AppMarkdown.vue';

const props = defineProps({
  type: { type: String, default: 'text' },
  customClass: { type: String, default: '' },
});
const textType = ['text', 'block', 'header', 'span-block', 'link'];
const isSpanBlock = props.type == 'span-block';

if (!textType.includes(props.type))
  throw Error(`ee-text:: Invalid type ${props.type} `);
</script>

<template>
  <app-markdown v-if="type == 'header'" :header="true" :class="customClass">
    <h1><slot /></h1>
  </app-markdown>
  <app-markdown v-else-if="type == 'block'" :class="customClass">
    <p><slot /></p>
  </app-markdown>
  <app-markdown
    v-else
    :class="['ux-text', customClass, { '--block': isSpanBlock }]"
  >
    <slot />
  </app-markdown>
</template>

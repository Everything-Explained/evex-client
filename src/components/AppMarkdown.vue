<script lang="ts" setup>
import { emailRecipients, getEmail } from '@/globals';
import { ref } from 'vue';

const props = defineProps({
  simple: { type: Boolean, default: true },
  header: { type: Boolean, default: false },
  html: { type: String, default: '', required: false },
});

const customHTMLContent = ref(props.html);
renderEmail();

function renderEmail() {
  for (const name of emailRecipients) {
    const emailStr = getEmail(name);
    const emailLink = `<a href="mailto:${emailStr}?subject=EvEx - Website Feedback">${emailStr}</a>`;
    customHTMLContent.value = customHTMLContent.value.replaceAll(
      `@${name}@`,
      emailLink
    );
  }
}
</script>

<template>
  <div
    :class="[
      { 'md-header': header },
      { md: !simple && !header },
      { 'md-simple': simple && !header },
    ]"
  >
    <slot v-if="!html" />
    <div v-else v-html="customHTMLContent" />
  </div>
</template>

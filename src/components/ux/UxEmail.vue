<script lang="ts" setup>
import { EmailRecipients, getEmail } from '@/globals';
import { PropType } from 'vue';

defineProps({
  name: { type: String as PropType<EmailRecipients>, required: true },
  subject: { type: String as PropType<string>, required: true },
  text: { type: String as PropType<string>, required: false, default: '' },
});
</script>

<template>
  <a :href="`mailto:${getEmail(name)}?subject=${subject}`">
    {{ text || getEmail(name) }}
  </a>
</template>

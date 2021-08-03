<template>
  <div :class="['preloader', { 'page': page }]" />
</template>




<script lang='ts' setup>
import { defineProps } from 'vue';

const props = defineProps({
  // If preloader spans whole page
  page: { type: Boolean, default: true }
});
</script>


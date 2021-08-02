<template>
  <div :class="['preloader', { 'page': page }]" />
</template>




<script lang='ts' setup>
  import './styles/ux-preloader.css';
  import { defineProps } from 'vue';

  const props = defineProps({
    // If preloader spans whole page
    page: { type: Boolean, default: true }
  });
</script>


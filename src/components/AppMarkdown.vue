<template>
  <div
    :class="[
      { 'md': !simple },
      { 'md-default md-em md-bold': simple }
    ]"
  >
    <slot />
  </div>
</template>

<script lang='ts' setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    simple: { type: Boolean, default: false }
  });
</script>


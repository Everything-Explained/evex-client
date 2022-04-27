<template>
  <div :class="['preloader', { 'page': page }]" />
</template>




<script lang='ts' setup>

defineProps({
  // If preloader spans whole page
  page: { type: Boolean, default: true }
});

</script>


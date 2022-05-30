
<script lang="ts" setup>
defineProps({
  simple : { type: Boolean, default: true  },
  header : { type: Boolean, default: false },
});
</script>




<template>
  <div
    :class="[
      { 'md-header': header },
      { 'md': !simple && !header },
      { 'md-simple': simple && !header },
    ]"
  >
    <slot />
  </div>
</template>



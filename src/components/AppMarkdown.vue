<template>
  <div
    :class="[
      { 'md-header': header },
      { 'md': isMD },
      { 'md-simple': isSimple },
    ]"
  >
    <slot />
  </div>
</template>




<script lang='ts' setup>
import { defineProps } from 'vue';

const props = defineProps({
  simple   : { type: Boolean, default: true  },
  header   : { type: Boolean, default: false },
});

const isSimple = props.simple && !props.header;
const isMD     = !props.simple && !props.header;
</script>


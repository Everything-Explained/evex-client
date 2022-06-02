

<script lang='ts' setup>
import { PropType } from 'vue';


defineProps({
  // If preloader spans whole page
  page: { type: Boolean, default: true },
  type: { type: String as PropType<'ripple'|'image'>,  default: 'ripple'    }
});

</script>





<template>
  <div v-if="type == 'ripple'" :class="['preloader', { 'page': page }]" />
  <div
    v-else-if="type == 'image'"
    :class="['.preloader', 'preloader__image-wrapper']"
  >
    <div class="preloader__image-placeholder" />
  </div>
</template>







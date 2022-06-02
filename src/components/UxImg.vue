<template>
  <div ref="containerRef" class="ux-img">
    <ux-preloader
      v-if="state.showPreloader"
      type="image"
      :page="false"
      :class="['ux-img__preloader', { '--disabled': state.loaded }]"
    />
    <img
      ref="imgRef"
      :class="['ux-img__image', { '--loaded': state.loaded }]"
      alt=""
    >
  </div>
</template>





<script lang="ts" setup>
import { onMounted, watch } from "vue";
import UxPreloader from './UxPreloader.vue';
import { useImageObserver } from '@/composeables/imageObserver';


const props = defineProps({
  src:   { type: String,  required: true },
  asset: { type: Boolean, default: false },
});

const { detectImageAssetSize, observeImage, imgRef, state, containerRef }
  = useImageObserver(props)
;

onMounted(() => {
  detectImageAssetSize();
  observeImage();
  // Reload image if src changes
  watch(() => props.src, () => {
    state.img.src = '';
    state.loaded = false;
    observeImage();
  });
});
</script>

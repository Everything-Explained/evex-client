<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import UxPreloader from '@/components/ux/UxPreloader.vue';

const props = defineProps({
  id: { type: String as PropType<string>, required: true },
  api: { type: String as PropType<'youtube'>, required: true },
});

const imgURL = ref('');
const ytImg = ref<HTMLElement>();
const vidContainer = ref<HTMLElement>();
const showPreloader = ref(true);

if (props.api == 'youtube') {
  const ytIdRegex = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/;

  if (!props.id.match(ytIdRegex)) {
    throw Error(`Invalid Youtube ID: ${props.id}`);
  }

  imgURL.value = `https://img.youtube.com/vi/${props.id}/hqdefault.jpg`;

  onMounted(() => {
    if (ytImg.value)
      ytImg.value.addEventListener('load', () => {
        showPreloader.value = false;
      });
    if (!vidContainer.value) throw Error('Missing Video Container');
  });
}

function injectVideo() {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0`;
  iframe.allow =
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  if (vidContainer.value) {
    vidContainer.value.children[0].remove();
    vidContainer.value.append(iframe);
  }
}
</script>

<template>
  <div ref="vidContainer" class="ux-evid-container">
    <div class="overlay" @click="injectVideo">
      <ux-preloader v-if="showPreloader" type="image" />
      <img ref="ytImg" :class="{ '--show': !showPreloader }" :src="imgURL" />
      <div class="play-btn" />
    </div>
  </div>
</template>



<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";



const props = defineProps({
  id  : { type: String as PropType<string>   , required: true },
  api : { type: String as PropType<'youtube'>, required: true },
});

const imgURL = ref('');
const vidContainer = ref<HTMLElement>();

if (props.api == 'youtube') {
  const ytIdRegex = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/;

  if (!props.id.match(ytIdRegex)) {
    throw Error(`Invalid Youtube ID: ${props.id}`);
  }

  imgURL.value = `https://img.youtube.com/vi/${props.id}/hqdefault.jpg`;

  onMounted(() => {
    if (!vidContainer.value) throw Error('Missing Video Container');
  });
}

function injectVideo() {
  const iframe = document.createElement('iframe');
  iframe.src =`https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0`;
  iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
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
      <img :src="imgURL" alt="">
      <div class="play-btn" />
    </div>
  </div>
</template>



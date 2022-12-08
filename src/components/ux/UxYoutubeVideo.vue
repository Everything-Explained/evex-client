<script lang="ts" setup>
import { computed } from 'vue';
import { onMounted, PropType, ref } from 'vue';
import UxPreloader from '@/components/ux/UxPreloader.vue';

const props = defineProps({
  id: { type: String as PropType<string>, default: 'M7lc1UVf-VE' },
});

const isInjecting = ref(true);
const isPlayerLoading = ref(true);
const showPreloader = computed(
  () => isInjecting.value || isPlayerLoading.value
);

onMounted(tryInjectYTAPI);

function tryInjectYTAPI() {
  const scriptID = 'ytScript';

  if (document.getElementById(scriptID)) {
    createPlayer();
    isInjecting.value = false;
    return;
  }

  const scriptEl = document.createElement('script');
  scriptEl.id = scriptID;
  scriptEl.src = '//www.youtube.com/iframe_api';
  scriptEl.async = true;

  // Only executes once after script is injected
  window.onYouTubeIframeAPIReady = () => {
    createPlayer();
    isInjecting.value = false;
  };
  document.head.appendChild(scriptEl);
}

function createPlayer() {
  new window.YT.Player('YTVideo', {
    videoId: props.id,
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: (e: any) => {
        isPlayerLoading.value = false;
        e.target.playVideo();
      },
    },
  });
}
</script>

<template>
  <div class="ytvideo__container">
    <ux-preloader v-if="showPreloader" :page="false" type="image" />
    <iframe
      id="YTVideo"
      :class="['ytvideo__video video']"
      type="text/html"
      :src="`https://www.youtube-nocookie.com/embed/${props.id}?enablejsapi=1&version=3&vq=hd1080&rel=0`"
      allow="autoplay; encrypted-media"
      allowfullscreen
      frameborder="0"
    />
  </div>
</template>

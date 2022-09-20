<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import UxButton from './UxButton.vue';

const doc = document;
const disqusContainer = ref<HTMLElement>();
const isLoading = ref(false);
const showButton = ref(true);
const disqusThread = ref<HTMLElement>();

onUnmounted(() => {
  if (disqusThread.value) {
    // Prevent element from being cached between pages
    disqusThread.value.innerHTML = '';
  }
});

function onViewComment() {
  isLoading.value = true;
  loadDisqus();
  // Best guess when Disqus is done loading
  setTimeout(() => {
    isLoading.value = false;
    showButton.value = false;
    disqusContainer.value!.classList.add('--show');
  }, 600);
}

function loadDisqus() {
  if (doc.getElementById('disqus_script')) {
    window.DISQUS.reset({
      reload: true,
    });
    return;
  }
  injectDisqusScript();
}

function injectDisqusScript() {
  const script = doc.createElement('script');
  script.id = 'disqus_script';
  script.src = 'https://evex.disqus.com/embed.js';
  script.setAttribute('data-timestamp', `${Date.now()}`);
  doc.head.appendChild(script);
}
</script>

<template>
  <div class="disqus__reveal">
    <ux-button
      v-if="showButton"
      :loading="isLoading"
      theme="attention"
      @click="onViewComment"
    >
      <div class="disqus__text">View Comments</div>
    </ux-button>
  </div>
  <div ref="disqusContainer" class="disqus__container">
    <div id="disqus_thread" ref="disqusThread" />
  </div>
</template>

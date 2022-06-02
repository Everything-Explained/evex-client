

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import UxButton from './UxButton.vue';


const {uid} = defineProps({
  uid: { type: String, required: true },
})
const doc             = document;
const pageLocation    = cleanHref(doc.location.href);
const disqusContainer = ref<HTMLElement>();
const isLoading       = ref(false);
const showButton      = ref(true);


onMounted(() => {
  window.DISQUSWIDGETS.getCount({ reset: true });
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
      config: function() {
        this.page!.identifier = uid;
      }
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


function cleanHref(href: string) {
  if (href[href.length - 1] == '/') {
    return href.substring(0, href.length - 1);
  }
  return href;
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
      <div class="disqus__text">
        View&nbsp;
      </div>
      <div
        class="disqus__count disqus-comment-count"
        :data-disqus-url="pageLocation"
      />
    </ux-button>
  </div>
  <div ref="disqusContainer" class="disqus__container">
    <div id="disqus_thread" />
  </div>
</template>







<template>
  <footer ref="footRef" class="pg-footer">
    <span class="pg-footer__version">
      α<sup>3<sub><router-link :to="'/changelog/a3-insulation'">insulation</router-link></sub></sup>
    </span>
    <span class="pg-footer__copyright">
      <span>Copyright &#169; 2020 - 2021</span><br>
      <span>Everything Explained, Some Rights Reserved</span> <br>
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >Creative Commons BY-NC-SA-4.0 License</a><br>
    </span>
  </footer>
</template>


<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useEventBus } from "@/state/event-bus";

const { setFooterPos, debounceFooterPos, footRef } = useFooterPosition();
const eventBus = useEventBus();

eventBus.onUpdateFooter(debounceFooterPos);

onMounted(() => {
  setFooterPos();
  window.addEventListener('resize', debounceFooterPos);
});

onUnmounted(() => {
  window.removeEventListener('resize', debounceFooterPos);
  eventBus.off(debounceFooterPos);
});


function useFooterPosition() {
  const footRef = ref<HTMLElement>();
  const app = document.getElementById('App')!;

  let timeout = 0;
  function debounceFooterPos() {
    footRef.value!.style.position = 'relative';
    footRef.value!.style.bottom = 'auto';
    clearTimeout(timeout);
    timeout = setTimeout(setFooterPos, 30);
  }

  function setFooterPos() {
    const footHeight   = footRef.value!.clientHeight;
    const scrollOffset = footHeight + app.clientHeight;
    const scrollArea   = footHeight + window.innerHeight
    ;
    if (scrollOffset <= scrollArea) {
      footRef.value!.style.position = 'fixed';
      footRef.value!.style.bottom = '0';
    }
  }

  return { setFooterPos, debounceFooterPos, footRef };
}
</script>


import { isMobile } from "@/globals";
import { Video } from "@/typings/global-types";
import { onUnmounted, Ref, ref } from "vue";

export function useVideoPagination(allVideos: Ref<Video[]>) {
  const paginatedVideos = ref<Video[]>([]);
  const observedEl      = ref<HTMLElement>();
  const visiblePages    = ref(0);

  function displayVideoPage(page: number, amount = isMobile() ? 5 : 30) {
    visiblePages.value = page;
    paginatedVideos.value = allVideos.value.slice(0, page * amount);
  }

  function renderVideos() {
    if (!observedEl.value) return;
    const body          = document.body;
    const maxScrollDist = body.scrollHeight - window.innerHeight;
    const renderDist    = maxScrollDist - 700
    ;
    if (body.scrollTop >= renderDist) {
      displayVideoPage(visiblePages.value + 1);
    }
  }

  document.body.addEventListener('scroll', renderVideos);
  onUnmounted(() => document.body.removeEventListener('scroll', renderVideos));

  return { displayVideoPage, observedEl, videos: paginatedVideos };
}
import { isMobile } from '@/globals';
import { Video } from '@/typings/global-types';
import { onUnmounted, Ref, ref } from 'vue';

export function useVideoPagination(allVideos: Ref<Video[]>) {
  const paginatedVideos = ref<Video[]>([]);
  const visiblePages = ref(0);

  window.addEventListener('scroll', renderVideos);
  onUnmounted(() => window.removeEventListener('scroll', renderVideos));

  function displayVideoPage(page: number, amount = isMobile() ? 5 : 30) {
    if (allVideos.value.length == paginatedVideos.value.length) return;
    visiblePages.value = page;
    paginatedVideos.value = allVideos.value.slice(0, page * amount);
  }

  function renderVideos() {
    if (window.scrollY >= document.body.scrollHeight * 0.75) {
      displayVideoPage(visiblePages.value + 1);
    }
  }

  return {
    displayVideoPage,
    paginatedVideos,
    getPageNum: () => visiblePages.value,
  };
}

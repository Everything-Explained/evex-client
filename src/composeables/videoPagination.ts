import { isMobile } from '@/globals';
import { Video } from '@/typings/global-types';
import { onUnmounted, Ref, ref } from 'vue';

export function useVideoPagination(allVideos: Ref<Video[]>) {
  const paginatedVideos = ref<Video[]>([]);
  const visiblePages = ref(0);
  const scrollLimit = isMobile() ? 1000 : 1500;

  window.addEventListener('scroll', renderVideos);
  onUnmounted(() => window.removeEventListener('scroll', renderVideos));

  function displayVideoPage(page: number, amount = isMobile() ? 5 : 30) {
    const maxPagesDisplayed =
      allVideos.value.length == paginatedVideos.value.length;

    visiblePages.value = page;

    paginatedVideos.value = maxPagesDisplayed
      ? allVideos.value.slice()
      : allVideos.value.slice(0, page * amount);
  }

  function renderVideos() {
    const deltaY =
      document.body.scrollHeight - window.scrollY - window.innerHeight;

    if (deltaY <= scrollLimit) {
      displayVideoPage(visiblePages.value + 1);
    }
  }

  return {
    displayVideoPage,
    paginatedVideos,
    getPageNum: () => visiblePages.value,
  };
}

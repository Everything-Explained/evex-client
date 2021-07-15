<template>
  <div class="red33m">
    <pg-titlebar>RED33M Videos</pg-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="isVideoTaskRunning" class="preloader page" />
      <div v-else>
        <ux-filter
          :age-only="true"
          :persist="false"
          :items="rawVideos"
          @filter="onFilter"
        />
        <div ref="observedEl" class="red33m-video-list">
          <ux-video
            v-for="(v, i) of videos"
            :key="i"
            :video-id="v.id"
            :date="v.date"
            :desc="v.content"
            class="red33m-video"
          >
            {{ v.title }}
          </ux-video>
        </div>
        <!-- Loading footer before videos 'fixes' it to bottom -->
        <pg-footer v-if="videos.length" />
      </div>
    </transition>
  </div>
</template>




<script lang='ts'>
import { defineComponent, onUnmounted, Ref, ref } from "vue";
import useVideos    from "@/composeables/useVideos";
import { Video }    from "@/typings/global-types";
import { isMobile } from "@/globals";
// Components
import PageTitlebarVue from "@/components/PageTitlebar.vue";
import PageFooterVue   from "@/components/PageFooter.vue";
import uxVideoVue      from "@/components/UxVideo.vue";
import uxFilterVue     from "@/components/UxFilter.vue";



export default defineComponent({
  components: {
    'pg-titlebar' : PageTitlebarVue,
    'pg-footer'   : PageFooterVue,
    'ux-filter'   : uxFilterVue,
    'ux-video'    : uxVideoVue,
  },
  setup() {
    const maxVideosToStart = isMobile() ? 10 : 30;
    const { videos: rawVideos, getVideoTask } = useVideos<Video>('/data/red33m/videos.json');

    const videos = ref<Video[]>([]);

    const { displayVideoPage,
            observedEl,
            paginatedVideos } = useVideoPagination(videos)
    ;

    function onFilter(newVideos: Video[]) {
      videos.value = newVideos;
      displayVideoPage(1, maxVideosToStart);
    }

    const videoTask = getVideoTask(() => { displayVideoPage(1, maxVideosToStart); });
    videoTask.loadVideos();

    return {
      rawVideos,
      videos: paginatedVideos,
      observedEl,
      isVideoTaskRunning: videoTask.isRunning,
      onFilter,
    };
  }
});


function useVideoPagination(videos: Ref<Video[]>) {
  const paginatedVideos = ref<Video[]>([]);
  const observedEl      = ref<HTMLElement>();
  const visiblePages    = ref(0);

  function displayVideoPage(page: number, amount = isMobile() ? 5 : 30) {
    visiblePages.value = page;
    paginatedVideos.value = videos.value.slice(0, page * amount);
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

  return { displayVideoPage, observedEl, paginatedVideos };
}

</script>
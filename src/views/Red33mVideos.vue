<template>
  <div class="red33m">
    <pg-titlebar class="red-vid__titlebar">
      RED33M Videos
    </pg-titlebar>
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isLoadingVideos" />
      <div v-else>
        <ux-filter
          :age-only="true"
          :persist="false"
          :items="videos"
          @filter="onFilter"
        />
        <div ref="observedEl" class="red-vid__list">
          <ux-video
            v-for="(v, i) of visibleVideos"
            :key="i"
            :video-id="v.id"
            :date="v.date"
            :desc="v.content"
            class="red-vid__video"
          >
            {{ v.title }}
          </ux-video>
        </div>
        <!-- Loading footer before videos 'fixes' it to bottom -->
        <pg-footer v-if="visibleVideos.length" />
      </div>
    </transition>
  </div>
</template>




<script lang='ts'>
import './styles/red33m-videos.css';
import './styles/red33m-videos.mobile.css';
import { defineComponent, onUnmounted, Ref, ref } from "vue";
import useVideos    from "@/composeables/videos";
import { Video }    from "@/typings/global-types";
import { isMobile } from "@/globals";
// Components
import PageTitlebarVue from "@/components/PageTitlebar.vue";
import PageFooterVue   from "@/components/PageFooter.vue";
import uxVideoVue      from "@/components/UxVideo.vue";
import uxFilterVue     from "@/components/UxFilter.vue";
import UxPreloaderVue from '@/components/UxPreloader.vue';



export default defineComponent({
  components: {
    'ux-preloader': UxPreloaderVue,
    'pg-titlebar' : PageTitlebarVue,
    'pg-footer'   : PageFooterVue,
    'ux-filter'   : uxFilterVue,
    'ux-video'    : uxVideoVue,
  },
  setup() {
    const maxVideosToStart = isMobile() ? 10 : 30;
    const videosRef        = ref<Video[]>([]);

    const pagination           = useVideoPagination(videosRef);
    const { displayVideoPage } = pagination;

    const { videos, isLoadingVideos }
      = useVideos<Video>('/data/red33m/videos.json', () => displayVideoPage(1, maxVideosToStart))
    ;

    function onFilter(filteredVideos: Video[]) {
      videosRef.value = filteredVideos;
      displayVideoPage(1, maxVideosToStart);
    }

    return {
      videos,
      visibleVideos: pagination.videos,
      observedEl: pagination.observedEl,
      isLoadingVideos,
      onFilter,
    };
  }
});


function useVideoPagination(allVideos: Ref<Video[]>) {
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

</script>
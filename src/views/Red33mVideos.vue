

<script lang='ts' setup>
import useVideos    from "@/composeables/videos";
import { useVideoPagination } from "@/composeables/videoPagination";
import { Video }    from "@/typings/global-types";
import { isMobile } from "@/globals";
import PageTitlebar from "@/components/PageTitlebar.vue";
import PageFooter   from "@/components/PageFooter.vue";
import UxVideo      from "@/components/UxVideo.vue";
import UxFilter     from "@/components/UxFilter.vue";
import UxPreloader  from '@/components/UxPreloader.vue';





const {
  isPending,
  videos
} = useVideos<Video>('/data/videos/red33m');

const {
  observedEl,
  paginatedVideos,
  displayVideoPage
} = useVideoPagination(videos);


function onFilter(filteredVideos: Video[]) {
  videos.value = filteredVideos;
  displayVideoPage(1, isMobile() ? 10 : 30);
}

</script>





<template>
  <div class="red33m">
    <page-titlebar class="red-vid__titlebar">
      RED33M Videos
    </page-titlebar>
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isPending" />
      <div v-else>
        <ux-filter
          :age-only="true"
          :persist="false"
          :items="videos"
          @filter="onFilter"
        />
        <div ref="observedEl" class="red-vid__list">
          <ux-video
            v-for="(v, i) of paginatedVideos"
            :key="i"
            :video-id="v.id"
            :date="v.date"
            :summary="v.summary"
            class="red-vid__video"
          >
            {{ v.title }}
          </ux-video>
        </div>
        <!-- Loading footer before videos 'fixes' it to bottom -->
        <page-footer v-if="paginatedVideos.length" />
      </div>
    </transition>
  </div>
</template>





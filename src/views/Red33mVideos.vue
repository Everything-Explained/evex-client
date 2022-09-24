

<script lang="ts" setup>
import PageTitlebar             from '@/components/PageTitlebar.vue';
import PageFooter               from '@/components/PageFooter.vue';
import useVideos                from '@/composeables/videos';
import { Video }                from '@/typings/global-types';
import { computed, ref, watch } from 'vue';
import { DataCacheArrayKeys }   from '@/state/cache-state';
import { useDynamicPager }      from '@/composeables/dynamicPager';
import UxText                   from '@/components/UxText.vue';
import UxDisqus                 from '@/components/UxDisqus.vue';
import UxPreloader              from '@/components/UxPreloader.vue';
import UxYoutubeVideo           from '@/components/UxYoutubeVideo.vue';
import UxVideoList              from '@/components/UxVideoList.vue';





const uri: DataCacheArrayKeys = 'videos/red33m';

const {
  isPending,
  videos,
  isCached
} = useVideos<Video>(`/data/${uri}`);

const {
  setDynPages,
  goTo,
  activePage,
} = useDynamicPager<Video>('videos/red33m', 'id');

const title         = computed(() => activePage.value?.data.title || 'Videos');
const isLoadingAPI  = ref(false);



createVideoPages();



function createVideoPages() {
  const configurePages = () => {
    setDynPages(videos.value.map(v => ({name: v.id, data: v})));
  };

  if (isCached) { return configurePages(); }

  watch(isPending, (isPending) => {
    if (!isPending) { configurePages(); }
  });
}


</script>





<template>
  <div class="temp">
    <page-titlebar
      :no-fade="true"
      :is-red33m="true"
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isLoadingAPI || !videos.length" />
      <div v-else-if="!activePage">
        <ux-video-list
          id="red33m-video-list"
          :videos="videos"
          @click-video="goTo"
        />
        <page-footer />
      </div>
      <div v-else class="red__video-page">
        <div class="video-wrapper">
          <ux-youtube-video
            :id="activePage.data.id"
          />
        </div>
        <ux-text type="block">
          <span v-if="activePage.data.summary" v-html="activePage.data.summary" />
          <span v-else>No Description...</span>
        </ux-text>
        <ux-disqus />
        <page-footer />
      </div>
    </transition>
  </div>
</template>





<script lang="ts" setup>
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
import useVideos from '@/composeables/videos';
import { Video } from '@/typings/global-types';
import { computed, watch } from 'vue';
import { DataCacheArrayKeys } from '@/state/cache-state';
import { useDynamicPager } from '@/composeables/dynamicPager';
import UxText from '@/components/ux/UxText.vue';
import UxDisqus from '@/components/ux/UxDisqus.vue';
import UxPreloader from '@/components/ux/UxPreloader.vue';
import UxYoutubeVideo from '@/components/ux/UxYoutubeVideo.vue';
import UxVideoList from '@/components/ux/UxVideoList.vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/services/api_internal';

const uri: DataCacheArrayKeys = 'videos/red33m';
const version = useAPI().state.versions?.r3dVid.v;
if (!version) {
  throw Error('Missing RED33M video API version');
}
const { isPending, videos, isCached } = useVideos<Video>(
  `/data/${uri}`,
  version!
);

const { setDynPages, goTo, activePage } = useDynamicPager<Video>(
  'videos/red33m',
  'id',
  useRouter()
);

const title = computed(() => activePage.value?.data?.title || 'RED33M Videos');

createVideoPages();

function createVideoPages() {
  const configurePages = () => {
    setDynPages(videos.value.map((v) => ({ name: v.id, data: v })));
  };

  if (isCached) {
    return configurePages();
  }

  watch(isPending, (isPending) => {
    if (!isPending) {
      configurePages();
    }
  });
}
</script>

<template>
  <div>
    <page-titlebar
      :no-fade="true"
      :is-red33m="true"
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <!-- <ToBeDetermined /> -->
    <!-- <page-footer /> -->
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="!videos.length" />
      <div v-else-if="!activePage || !activePage.data">
        <ux-video-list
          id="red33m-video-list"
          :videos="videos"
          @click-video="goTo"
        />
        <page-footer />
      </div>
      <div v-else class="ux-video__video-page">
        <div class="video-wrapper">
          <ux-youtube-video :id="activePage.data.id" />
        </div>
        <ux-text type="block">
          <span
            v-if="activePage.data.summary"
            v-html="activePage.data.summary"
          />
          <span v-else>No Description...</span>
        </ux-text>
        <ux-disqus />
        <page-footer />
      </div>
    </transition>
  </div>
</template>

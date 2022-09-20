<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import { useVideoPagination } from '@/composeables/videoPagination';
import { Video } from '@/typings/global-types.js';
import { PropType } from 'vue';
import UxVideo from './UxVideo.vue';
import UxFilter from './UxFilter.vue';
import { isMobile } from '@/globals';
import { useDataCache } from '@/state/cache-state';

const props = defineProps({
  videos: { type: Array as PropType<Video[]>, required: true },
  id: { type: String, required: true },
});

defineEmits(['click-video']);

// Can no longer be updated by parent
const videos = ref(props.videos);

const { paginatedVideos, displayVideoPage, getPageNum } =
  useVideoPagination(videos);

const cache = useDataCache<number>();
let page = cache.getData('red33m-video-list').value;

onUnmounted(() => {
  cache.setData('red33m-video-list', getPageNum());
});

function filterVideos(filteredVideos: Video[]) {
  videos.value = filteredVideos;
  cache.setData('red33m-video-list', page);
  displayVideoPage(page, isMobile() ? 10 : 30);
}

function onAgeToggled() {
  page = 1;
}
</script>

<template>
  <div class="vid-list__container">
    <ux-filter
      :id="id"
      :age-only="true"
      :items="videos"
      :is-volatile="false"
      @age-toggled="onAgeToggled"
      @filter="filterVideos"
    />
    <div class="vid-list__videos">
      <ux-video
        v-for="v of paginatedVideos"
        :key="v.id"
        :video-id="v.id"
        :date="v.date"
        :summary="v.summary"
        class="video"
        @click="$emit('click-video', v.id)"
      >
        {{ v.title }}
      </ux-video>
      <!-- Keeps trailing videos the same column size and
            aligns them to the left -->
      <div class="hidden-item" />
      <div class="hidden-item" />
      <div class="hidden-item" />
      <div class="hidden-item" />
    </div>
  </div>
</template>

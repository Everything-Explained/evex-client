<script lang="ts" setup>
import { computed, Ref, ref, watch } from 'vue';
import useVideos from '@/composeables/videos';
import { DynamicPage, useDynamicPager } from '@/composeables/dynamicPager';
import { useDate } from '@/composeables/date';
import { isEthan } from '@/composeables/globals';
import { Video } from '@/typings/global-types';
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
import UxPreloader from '@/components/UxPreloader.vue';
import UxVideoList from '@/components/UxVideoList.vue';
import { useRouter } from 'vue-router';
import UxDisqus from '@/components/UxDisqus.vue';
import UxText from '@/components/UxText.vue';
import UxYoutubeVideo from '@/components/UxYoutubeVideo.vue';

type VideoCategory = { name: string; desc: string; videos: Video[] };

const router = useRouter();
const {
  videos: categories,
  isPending,
  isCached,
} = useVideos<VideoCategory>('/data/videos/public');

const {
  setDynPages: setDynCategories,
  goTo: goToCategory,
  activePage,
} = useDynamicPager<Video[]>('videos/public', 'category', router);

const videos = computed(() => activePage.value?.data);
const goToVideoPage = ref<(pageName: string) => void>(() => void 0);
const activeVideoPage = ref<Ref<DynamicPage<Video> | undefined>>();
const title = computed(
  () =>
    activeVideoPage.value?.value?.data?.title ||
    activePage.value?.title ||
    'Video Categories'
);

createVideoPages();
watch(activePage, (page) => {
  if (!page || !page.data) return;
  const pager = useDynamicPager<Video>(
    `videos/public/${page.uri}`,
    'id',
    router
  );
  pager.setDynPages(page.data.map((d) => ({ name: d.id, data: d })));
  goToVideoPage.value = pager.goTo;
  activeVideoPage.value = pager.activePage;
});

function createVideoPages() {
  const configurePages = () => {
    setDynCategories(
      categories.value.map((cat) => ({ name: cat.name, data: cat.videos }))
    );
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

function getAuthors(videos: Video[]) {
  return videos.reduce(toAuthors, [] as string[]);
}

function getLatestVideo(videos: Video[]) {
  return videos[videos.length - 1];
}

function toYouTubeLink(id: string) {
  return `//www.youtube-nocookie.com/embed/${id}?rel=0`;
}

function toAuthors(authors: string[], video: Video) {
  if (authors.includes(video.author)) return authors;
  authors.push(video.author);
  return authors;
}
</script>

<template>
  <div class="lib-vid">
    <page-titlebar
      :no-fade="true"
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="!categories.length" />
      <div v-else-if="!activePage">
        <div class="lib-vid__category-list">
          <div
            v-for="(cat, i) of categories"
            :key="i"
            class="lib-vid__category-container"
          >
            <div class="lib-vid__category">
              <h1 @click="goToCategory(cat.name)">
                {{ cat.name }}
              </h1>
              <div class="desc">
                {{ cat.desc }}
              </div>
              <h2>Contributing Authors</h2>
              <div class="desc --authors">
                <ul>
                  <li
                    v-for="(author, j) of getAuthors(cat.videos)"
                    :key="j"
                    :class="{ '--is-ethan': isEthan(author) }"
                  >
                    {{ author }}
                  </li>
                </ul>
              </div>
              <h2>
                Latest Video
                <span class="timestamp">
                  {{
                    useDate(getLatestVideo(cat.videos).date).toRelativeTime()
                  }}
                </span>
              </h2>
              <div class="desc">
                <a
                  :href="toYouTubeLink(getLatestVideo(cat.videos).id)"
                  target="_blank"
                  >{{ getLatestVideo(cat.videos).title }}</a
                >
                <br />
                <span
                  :class="[
                    'latest-author',
                    {
                      '--is-ethan': isEthan(getLatestVideo(cat.videos).author),
                    },
                  ]"
                >
                  ~ {{ getLatestVideo(cat.videos).author }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <page-footer />
      </div>
      <div v-else-if="activePage && videos?.length && !activeVideoPage?.value">
        <ux-video-list
          :id="activePage.title"
          :videos="videos"
          :show-author="true"
          @click-video="goToVideoPage"
        />
        <page-footer />
      </div>
      <div v-else-if="activeVideoPage?.value" class="ux-video__video-page">
        <div class="video-wrapper">
          <ux-youtube-video :id="activeVideoPage.value.data?.id" />
        </div>
        <ux-text type="block">
          <span
            v-if="activeVideoPage.value.data?.summary"
            v-html="activeVideoPage.value.data.summary"
          />
          <span v-else>No Description...</span>
        </ux-text>
        <ux-disqus />
        <page-footer />
      </div>
    </transition>
  </div>
</template>

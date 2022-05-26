<template>
  <div class="lib-vid">
    <page-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isLoadingVideos" />
      <div v-else-if="categories.length && !activePage">
        <div class="lib-vid__category-list">
          <div v-for="(cat, i) of categories"
               :key="i"
               class="lib-vid__category-container"
          >
            <div class="lib-vid__category">
              <h1 @click="goTo(cat.name)">
                {{ cat.name }}
              </h1>
              <div class="desc">
                {{ cat.desc }}
              </div>
              <h2>Contributing Authors</h2>
              <div class="desc --authors">
                <ul>
                  <li v-for="(author, j) of getAuthors(cat.videos)"
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
                  {{ useDate(getLatestVideo(cat.videos).date).toRelativeTime() }}
                </span>
              </h2>
              <div class="desc">
                <a :href="toYouTubeLink(getLatestVideo(cat.videos).id)"
                   target="_blank"
                >{{ getLatestVideo(cat.videos).title }}</a>
                <br>
                <span :class="['latest-author',
                               { '--is-ethan': isEthan(getLatestVideo(cat.videos).author) }]"
                > ~ {{ getLatestVideo(cat.videos).author }}</span>
              </div>
            </div>
          </div>
        </div>
        <page-footer />
      </div>
      <div v-else-if="activePage">
        <ux-filter
          :items="activePage.data"
          :persist="false"
          @filter="onFilter"
        />
        <div class="lib-vid__video-list">
          <ux-video
            v-for="(v, j) of visibleVideos"
            :key="j"
            class="lib-vid__video"
            :video-id="v.id"
            :desc="v.summary"
            :date="v.date"
            :author="v.author"
          >
            {{ v.title }}
          </ux-video>
        </div>
        <page-footer />
      </div>
    </transition>
  </div>
</template>





<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import useVideos           from "@/composeables/videos";
import { useDynamicPager } from "@/composeables/dynamicPager";
import { useDate }         from "@/composeables/date";
import { isEthan }         from "@/composeables/globals";
import { Video }           from "@/typings/global-types";
import PageTitlebar        from "@/components/PageTitlebar.vue";
import PageFooter          from "@/components/PageFooter.vue";
import UxFilter            from "@/components/UxFilter.vue";
import UxVideo             from "@/components/UxVideo.vue";
import UxPreloader         from '@/components/UxPreloader.vue';


type VideoCategory = { name: string; desc: string; videos: Video[] };


const { setDynPages, goTo, activePage, }     = useDynamicPager('library/videos');
const { videos: categories, isLoadingVideos} = useVideos<VideoCategory>(
  '/data/library/videos',
  (vidCats) => {
    setDynPages(vidCats.map(cat => ({ name: cat.name, data: cat.videos })));
  }
);

// Prevent loading of inherently cached videos
watch(() => activePage.value, (page) => {
  if (!page?.data) { visibleVideos.value = []; }
});

const visibleVideos = ref<Video[]>([]);
const title         = computed(() => activePage.value?.title || 'Video Categories');

const onFilter       = (videos: Video[]) => visibleVideos.value = videos;
const getAuthors     = (videos: Video[]) => videos.reduce(toAuthors, [] as string[]);
const getLatestVideo = (videos: Video[]) => videos[videos.length - 1];
const toYouTubeLink  = (id: string)      => `//www.youtube-nocookie.com/embed/${id}?rel=0`;

function toAuthors(authors: string[], video: Video) {
  if (authors.includes(video.author)) return authors;
  authors.push(video.author);
  return authors;
}

</script>



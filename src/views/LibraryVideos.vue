<template>
  <div class="lib-vid">
    <pg-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="title"
    />
    <transition name="fade" mode="out-in">
      <div v-if="videoTask.isRunning.value" class="preloader page" />
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
                {{ cat.description }}
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
        <pg-footer />
      </div>
      <div v-else-if="activePage">
        <ux-filter
          :items="activePage.data"
          :persist="false"
          @filter="onFilter"
        />
        <div class="lib-vid__video-list">
          <ux-video
            v-for="(v, j) of activeVideos"
            :key="j"
            class="lib-vid__video"
            :video-id="v.id"
            :desc="v.content"
            :date="v.date"
            :author="v.author"
          >
            {{ v.title }}
          </ux-video>
        </div>
        <pg-footer />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import useVideos           from "@/composeables/videos";
import { useDynamicPager } from "@/composeables/dynamicPager";
import { useDate }         from "@/composeables/date";
import { isEthan }         from "@/composeables/globals";
import { Video }           from "@/typings/global-types";
import PageTitleBarVue     from "@/components/PageTitlebar.vue";
import PageFooterVue       from "@/components/PageFooter.vue";
import uxFilterVue         from "@/components/UxFilter.vue";
import uxVideoVue          from "@/components/UxVideo.vue";

type VideoCategory = { name: string; description: string; videos: Video[] };

export default defineComponent({
  components: {
    'pg-titlebar' : PageTitleBarVue,
    'pg-footer'   : PageFooterVue,
    'ux-video'    : uxVideoVue,
    'ux-filter'   : uxFilterVue,
  },
  setup() {
    const { videos: categories, getVideoTask } = useVideos<VideoCategory>('/data/library/videos.json');
    const { setDynPages, goTo, activePage, }   = useDynamicPager('library/videos');

    const videoTask = getVideoTask(() => {
      setDynPages(categories.value.map(cat => ({ name: cat.name, data: cat.videos })));
    });

    // Prevent loading of inherently cached videos
    watch(() => activePage.value, (page) => {
      if (!page?.data) { activeVideos.value = []; }
    });

    const activeVideos = ref<Video[]>([]);
    function onFilter(videos: Video[]) { activeVideos.value = videos; }

    videoTask.loadVideos();

    return {
      getAuthors:     (videos: Video[]) => videos.reduce(toAuthors, [] as string[]),
      getLatestVideo: (videos: Video[]) => videos[videos.length - 1],
      toYouTubeLink:  (id: string)      => `//www.youtube-nocookie.com/embed/${id}?rel=0`,
      useDate,
      goTo,
      isEthan,
      onFilter,
      title        : computed(() => activePage.value?.title || 'Video Categories'),
      categories,
      videoTask,
      activePage,
      activeVideos,
    };
  }
});




function toAuthors(authors: string[], video: Video) {
  if (authors.includes(video.author)) return authors;
  authors.push(video.author);
  return authors;
}
</script>



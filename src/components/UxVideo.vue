<template>
  <div class="ee-video">
    <div class="ee-video_img-container">
      <div class="ee-video__thumbnail-container">
        <ux-img :src="thumbnail" class="ee-video_img" />
      </div>
      <div :class="['ee-video_text-widget', { '--open': descState }]">
        {{ useDate(date).toRelativeTime() }}
      </div>
      <ux-icon
        :class="['ee-video_widget ee-video_widget-open-video', { '--open': descState }]"
        type="export"
        @click="openVideo"
      />
      <ux-icon
        v-if="description"
        :class="['ee-video_widget ee-video_widget-open-desc', { '--open': descState }]"
        type="info"
        @click="setDescState('open')"
      />
      <div :class="['ee-video_desc', { '--open': descState }]">
        <ux-icon
          class="ee-video_widget ee-video_widget-close-desc"
          type="cross"
          @click="setDescState('closed')"
        />
        <div class="ee-video-desc_text">
          <h1>Description</h1>
          <span class="--default-scrollbar" v-html="description" />
        </div>
      </div>
    </div>
    <div class="ee-video__info-bar">
      <div class="ee-video_title">
        <slot />
      </div>
      <div v-if="author" :class="['ee-video__author', { '--is-ethan': isEthan(author) }]">
        <ux-icon type="user" /> {{ author }}
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import { computed, defineComponent, ref, toRefs } from "vue";
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
// components
import uxIconVue from '@/components/UxIcon.vue';
import uxImgVue from "../UxImg.vue";

export default defineComponent({
  components: { 'ux-img': uxImgVue, 'ux-icon': uxIconVue, },
  props: {
    desc    : { type: String, default: '' },
    videoId : { type: String, default: '' },
    date    : { type: String, default: '' },
    author  : { type: String, default: '' },
  },
  setup(props) {
    const { videoId, desc } = toRefs(props);
    const descStateRef = ref(false);
    const thumbnailRef = computed(() =>
      `//img.youtube.com/vi/${videoId.value}/0.jpg`
    );

    function openVideo() {
      window.open(
        `//www.youtube-nocookie.com/embed/${videoId.value}?rel=0`,
        '_blank'
      );
    }

    function setDescState(state: 'closed'|'open') {
      descStateRef.value = state == 'open';
    }

    return {
      thumbnail: thumbnailRef,
      description: desc,
      descState: descStateRef,
      openVideo, setDescState, useDate, isEthan
    };
  }
});
</script>
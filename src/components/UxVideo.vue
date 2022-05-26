<template>
  <div class="ux-video">
    <div class="ux-video__thumb-container">
      <ux-img :src="thumbnailRef" class="ux-video__thumb" />
    </div>
    <div class="ux-video__widget-container">
      <div :class="['ux-video__widget timestamp', { '--open': descState }]">
        {{ useDate(date).toRelativeTime() }}
      </div>
      <ux-icon
        :class="[
          'ux-video__widget video-link',
          { '--open': descState }
        ]"
        type="export"
        @click="openVideo"
      />
      <ux-icon
        v-if="summary"
        :class="[
          'ux-video__widget desc',
          { '--open': descState }
        ]"
        type="info"
        @click="setDescState('open')"
      />
      <div :class="['ux-video__desc', { '--open': descState }]">
        <ux-icon
          class="close-desc"
          type="cross"
          @click="setDescState('closed')"
        />
        <div class="text">
          <h1>Description</h1>
          <span class="--default-scrollbar" v-html="summary" />
        </div>
      </div>
    </div>
    <div class="ux-video__info">
      <div class="title">
        <slot />
      </div>
      <div v-if="author" :class="['author', { '--is-ethan': isEthan(author) }]">
        <ux-icon type="user" class="author__icon" /> {{ author }}
      </div>
    </div>
  </div>
</template>





<script lang='ts' setup>
import { computed, ref, toRefs } from "vue";
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
import UxIcon from '@/components/UxIcon.vue';
import UxImg  from "./UxImg.vue";


const props             = defineProps({
  summary : { type: String, default: '' },
  videoId : { type: String, default: '' },
  date    : { type: String, default: '' },
  author  : { type: String, default: '' },
});
const { videoId, summary } = toRefs(props);
const descState         = ref(false);
const thumbnailRef      = computed(() =>
  `//img.youtube.com/vi/${videoId.value}/0.jpg`
);

function openVideo() {
  window.open(
    `//www.youtube-nocookie.com/embed/${videoId.value}?rel=0`,
    '_blank'
  );
}

function setDescState(state: 'closed'|'open') {
  descState.value = state == 'open';
}

</script>



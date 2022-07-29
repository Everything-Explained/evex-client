

<script lang='ts' setup>
import { computed, ref, toRefs } from "vue";
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
import UxIcon from '@/components/UxIcon.vue';
import UxImg  from "./UxImg.vue";
import UxBullet from "./UxBullet.vue";


const props             = defineProps({
  summary : { type: String, default: '' },
  videoId : { type: String, default: '' },
  date    : { type: String, default: '' },
  author  : { type: String, default: '' },
});
const { videoId, summary } = toRefs(props);
const descState         = ref(false);
const thumbnailRef      = computed(() =>
  `//i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`
);

function openVideo() {
  window.open(
    `//www.youtube-nocookie.com/embed/${videoId.value}?rel=0`,
    '_blank'
  );
}

function setDescState(e: MouseEvent, state: 'closed'|'open') {
  stopPropagation(e);
  descState.value = state == 'open';
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
  e.stopImmediatePropagation();
}

</script>





<template>
  <div class="ux-video">
    <div class="ux-video__thumb-container">
      <ux-img :src="thumbnailRef" class="ux-video__thumb" />
    </div>
    <div class="ux-video__widget-container">
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
        @click="setDescState($event, 'open')"
      />
      <div :class="['ux-video__desc', { '--open': descState }]" @click="stopPropagation($event)">
        <ux-icon
          class="close-desc"
          type="cross"
          @click="setDescState($event, 'closed')"
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
      <div class="details">
        <div v-if="author" class="author">
          <ux-icon type="user" :class="['author__icon', { '--is-ethan': isEthan(author)}]" /> {{ author }}
        </div>
        <span v-if="author">&nbsp;<ux-bullet class="bullet" />&nbsp;</span>
        <div class="timestamp">
          {{ useDate(date).toRelativeTime() }}
        </div>
      </div>
    </div>
  </div>
</template>









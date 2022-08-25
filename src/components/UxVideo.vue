

<script lang='ts' setup>
import { computed, toRefs } from "vue";
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

defineEmits(['click']);

const { videoId } = toRefs(props);
const thumbnailRef      = computed(() =>
  `//i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`
);
const dateObj = useDate(props.date);
const shortDate = dateObj.toShortDate();
const relativeTime = dateObj.toRelativeTime();

</script>





<template>
  <div class="ux-video">
    <div class="ux-video__thumb-container" @click="$emit('click')">
      <ux-img :src="thumbnailRef" class="ux-video__thumb" />
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
          {{ relativeTime }}
        </div>
        &nbsp;<ux-bullet />&nbsp;
        <div class="timestamp">
          {{ shortDate }}
        </div>
      </div>
    </div>
  </div>
</template>









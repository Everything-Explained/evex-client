<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useDate } from '@/composeables/date';
import { isEthan } from '@/composeables/globals';
import UxIcon from '@/components/ux/UxIcon.vue';
import UxImg from '@/components/ux/UxImg.vue';

const props = defineProps({
  summary: { type: String, default: '' },
  videoId: { type: String, default: '' },
  date: { type: String, default: '' },
  author: { type: String, default: '' },
});

defineEmits(['click']);

const { videoId } = toRefs(props);
const thumbnailRef = computed(
  () => `//i.ytimg.com/vi/${videoId.value}/hqdefault.jpg`
);
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
          <span>{{ author.trim() }}</span>
          <ux-icon
            :class="['author__icon', { '--is-ethan': isEthan(author) }]"
            type="user"
          />
        </div>
        <div class="timestamp">
          <span>{{ useDate(date).toHybridTime() }}</span>
          <ux-icon type="clock" />
        </div>
      </div>
    </div>
  </div>
</template>

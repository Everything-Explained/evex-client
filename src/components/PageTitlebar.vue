<script lang="ts" setup>
import { useDataCache } from '@/state/cache-state';
import UxIcon from '@/components/UxIcon.vue';

const props = defineProps({
  easeIn: { type: Number, default: 400 },
  easeOut: { type: Number, default: 400 },
  text: { type: String, default: '' },
  isRed33m: { type: Boolean, default: false },
  noFade: { type: Boolean, default: false },
});

const stateStr = 'titlebar-menu-open';
const dataCache = useDataCache<boolean>();
const isMenuOpen = dataCache.getData(stateStr);
const duration = {
  enter: props.easeIn,
  leave: props.easeOut,
};

const openMenu = () => dataCache.setData(stateStr, true);
</script>

<template>
  <div class="titlebar-container">
    <div :class="['titlebar-ribbon', { red33m: isRed33m }]" />
    <div :class="['pg-titlebar', { red33m: isRed33m }]">
      <ux-icon
        :class="[
          'pg-titlebar__menu-icon',
          { '--menu-open': isMenuOpen, red33m: isRed33m },
        ]"
        :type="'menu'"
        @mousedown="openMenu"
      />
      <transition name="fade" :duration="duration" mode="out-in">
        <div :key="text" :class="['pg-titlebar__text', { red33m: isRed33m }]">
          {{ text }} <slot />
        </div>
      </transition>
    </div>
    <div :class="['titlebar-ribbon bottom', { red33m: isRed33m }]" />
    <div v-if="!noFade" class="titlebar-content-fader" />
  </div>
</template>

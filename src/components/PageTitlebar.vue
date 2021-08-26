<template>
  <div class="pg-titlebar">
    <ux-icon
      :class="['pg-titlebar__menu-icon', { '--menu-open': isMenuOpen }]"
      :type="'menu'"
      @mousedown="openMenu"
    />
    <transition
      name="fade"
      :duration="duration"
      mode="out-in"
    >
      <div :key="text" class="pg-titlebar__text">
        {{ text }} <slot />
      </div>
    </transition>
  </div>
</template>





<script lang='ts' setup>
import { defineProps } from "vue";
import { useDataCache } from "@/state/cache-state";
import UxIcon from '@/components/UxIcon.vue';


const props = defineProps({
  easeIn:  { type: Number, default: 400 },
  easeOut: { type: Number, default: 400 },
  text:    { type: String, default: '' }
});

const stateStr   = 'titlebar-menu-open';
const dataCache  = useDataCache<boolean>();
const isMenuOpen = dataCache.getData(stateStr);
const duration   = {
  enter: props.easeIn ?? 400,
  leave: props.easeOut ?? 400
};

const openMenu = () => dataCache.setData(stateStr, true);

</script>

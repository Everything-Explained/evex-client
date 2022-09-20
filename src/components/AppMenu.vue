<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useDataCache } from '@/state/cache-state';
import { useRouteMap } from '@/composeables/routeMap';
import { useEventBus } from '@/state/event-bus';
import UxIcon from '@/components/UxIcon.vue';

interface ExternalElements {
  main: HTMLElement;
  body: HTMLElement;
  header: HTMLElement;
  menu: HTMLDivElement;
  closeHelper: HTMLDivElement;
}

const props = defineProps({
  contentId: { type: String, required: true },
  headerId: { type: String, required: true },
});

const menu = ref<HTMLDivElement>();
const opened = ref(false);
const dataCache = useDataCache<boolean>();
const isMenuOpening = dataCache.getData('titlebar-menu-open');
const routeMap = useRouteMap();

let els: ExternalElements;

useEventBus().on('update-menu', (routeName, visibility) => {
  for (const routeCat of routeMap) {
    const route = routeCat.routes.find((r) => r.name == routeName);
    if (route) return (route.visible = visibility);
  }
});

onMounted(() => {
  els = {
    // FIX: We should NOT ASSUME that <main> exists
    main: document.getElementsByTagName('main')![0],
    body: document.getElementById(props.contentId)!,
    header: document.getElementById(props.headerId)!,
    menu: menu.value!,
    closeHelper: document.createElement('div'),
  };
  verifyEls(els);
  els.closeHelper.classList.add('app-menu__close-menu-area');
  els.closeHelper.addEventListener('mousedown', closeMenu);
  els.main.appendChild(els.closeHelper);
  affixOnScroll();
});

watch(() => isMenuOpening.value, toggleMenu);

function verifyEls(els: ExternalElements) {
  let key: keyof typeof els;
  for (key in els) {
    if (!els[key]) throw Error(`<app-menu>::missing element::${key}`);
  }
}

function affixOnScroll() {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const menu = els.menu;
    const pos = menu.style.position;
    if (scrollTop >= els.header.offsetHeight + 1) {
      if (pos != 'fixed') menu.style.position = 'fixed';
      return;
    }
    menu.style.position = 'absolute';
  });
}

function toggleMenu(state: boolean) {
  opened.value = state;
  els.body.classList[state ? 'add' : 'remove']('--menu-open');
  els.closeHelper.classList[state ? 'add' : 'remove']('--menu-open');
}

function closeMenu() {
  dataCache.setData('titlebar-menu-open', false);
}
</script>

<template>
  <menu ref="menu" :class="['app-menu', { '--opened': opened }]">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <ux-icon
        class="app-menu__exit-icon"
        :type="'cross'"
        @mousedown="closeMenu"
      />
    </header>
    <ul>
      <template v-for="(map, i) of routeMap" :key="i">
        <template v-if="map.visible">
          <li v-if="map.name != 'root'" class="app-menu__category">
            {{ map.name }}
          </li>
          <template v-for="(route, j) of map.routes" :key="j">
            <li v-if="route.visible" class="app-menu__item" @click="closeMenu">
              <router-link :to="{ name: route.name }">
                {{ route.title }}
              </router-link>
            </li>
          </template>
        </template>
      </template>
    </ul>
  </menu>
</template>

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
            <li
              v-if="route.visible"
              class="app-menu__item"
              @click="closeMenu"
            >
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





<script lang='ts' setup>
import { computed, onMounted, ref, watch, Ref } from "vue";
import { useDataCache } from "@/state/cache-state";
import { useRouteMap }  from "@/composeables/routeMap";
import { useEventBus }  from "@/state/event-bus";
import UxIcon           from '@/components/UxIcon.vue';


interface ExternalElements {
  body        ?: HTMLElement;
  header      ?: HTMLElement;
  menu        ?: Ref<HTMLDivElement>;
  closeHelper ?: HTMLDivElement;
}


const props         = defineProps({
  contentId : { type: String, required: true },
  headerId  : { type: String, required: true },
});
const menuElRef     = ref<HTMLDivElement|null>(null);
const opened        = ref(false);
const dataCache     = useDataCache<boolean>();
const isMenuOpening = dataCache.getData('titlebar-menu-open');
const routeMap      = useRouteMap();
const els           = { menu: computed(() => menuElRef.value!) } as ExternalElements;
const menu          = menuElRef; // From DOM

useEventBus().on('update-menu', (routeName, visibility) => {
  for (const routeCat of routeMap) {
    const route = routeCat.routes.find(r => r.name == routeName);
    if (route) return route.visible = visibility;
  }
});

onMounted(setup);
watch(() => isMenuOpening.value, toggleMenu);

function setup() {
  els.body        = document.getElementById(props.contentId)!;
  els.header      = document.getElementById(props.headerId)!;
  els.closeHelper = document.createElement('div');
  els.closeHelper.classList.add('app-menu__close-menu-area');
  els.closeHelper.addEventListener('mousedown', closeMenu);
  // FIX: We should NOT ASSUME that <main> exists
  const mainEl = document.getElementsByTagName('main')![0];
  mainEl.appendChild(els.closeHelper);
  affixOnScroll();
}

function toggleMenu(state: boolean) {
  opened.value = state;
  els.body?.classList[state ? 'add' : 'remove']('--menu-open');
  els.closeHelper?.classList[state ? 'add' : 'remove']('--menu-open');
}

function affixOnScroll() {
  document.body.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop;
    const menu      = els.menu!;
    const pos       = menu.value.style.position
    ;
    if (scrollTop >= els.header!.offsetHeight + 1) {
      if (pos != 'fixed') menu.value.style.position = 'fixed';
      return;
    }
    menu.value.style.position = 'absolute';
  });
}

function closeMenu() { dataCache.setData('titlebar-menu-open', false); }


</script>




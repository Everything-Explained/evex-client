<template>
  <menu ref="menu" :class="['app-menu', { '--opened': opened }]">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <ee-icon
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



<script lang='ts'>
import { computed, defineComponent, onMounted, ref, watch, Ref } from "vue";
import eeIconVue from '@/components/UxIcon.vue';
import { useDateCache } from "@/state/cache-state";
import { useRouteMap } from "@/composeables/routeMap";
import { useEventBus } from "@/state/event-bus";


interface ExternalElements {
  body   ?: HTMLElement;
  header ?: HTMLElement;
  menu   ?: Ref<HTMLDivElement>;
  closeHelper ?: HTMLDivElement;
}

export default defineComponent({
  components: {
    'ee-icon': eeIconVue,
  },
  props: {
    contentId : { type: String, default: '' },
    headerId  : { type: String, default: '' },
  },
  setup(props) {
    const menuElRef = ref<HTMLDivElement|null>(null);
    const opened  = ref(false);
    const dataCache = useDateCache<boolean>();
    const isMenuOpening = dataCache.getData('titlebar-menu-open');
    const routeMap = useRouteMap();
    const eventBus = useEventBus();

    eventBus.onUpdateMenu((routeName, visibility) => {
      for (const routeCat of routeMap) {
        const route = routeCat.routes.find(r => r.name == routeName);
        if (route) return route.visible = visibility;
      }
    });

    if (!props.contentId) throw Error('Missing content ID');

    const els: ExternalElements = { menu: computed(() => menuElRef.value!) };

    function floatOnScroll() {
      document.body.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop;
        const menu      = els.menu!;
        const pos       = menu.value.style.position
        ;
        if (scrollTop >= els.header!.offsetHeight + 1) {
               if (pos != 'fixed')    menu.value.style.position = 'fixed';
        } else if (pos != 'absolute') menu.value.style.position = 'absolute';
      });
    }

    // Setup events and animation style
    onMounted(() => {
      els.body    = document.getElementById(props.contentId!)!;
      els.header  = document.getElementById(props.headerId!)!;
      els.closeHelper = document.createElement('div');
      els.closeHelper.classList.add('app-menu__close-menu-area');
      els.closeHelper.addEventListener('click', closeMenu);
      document.body.appendChild(els.closeHelper);
      if (menuElRef.value && els.body) { floatOnScroll(); }
    });

    // Toggle menu
    watch(() => isMenuOpening.value,
      async (isOpening) => {
        opened.value = isOpening;
        els.body?.classList[isOpening ? 'add' : 'remove']('--menu-open');
        els.closeHelper?.classList[isOpening ? 'add' : 'remove']('--menu-open');
    });

    function closeMenu() { dataCache.setData('titlebar-menu-open', false); }

    return {
      menu: menuElRef,
      opened,
      closeMenu,
      routeMap,
    };
  }
});
</script>




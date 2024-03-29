<script lang="ts" setup>
import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDate } from './composeables/date';
import { ISODateString } from './typings/global-types';
import AppMenu from '@/components/AppMenu.vue';
import UxIcon from './components/ux/UxIcon.vue';
import { useDataCache } from './state/cache-state';

type ManagedPages = Array<{ scrollPos: Ref<number>; url: string }>;

const { isToastVisible, isToastClosed, closeToast, openChangeLog } =
  useVersionToast('2022-11-30T16:19:45.193Z', 'a6--vision');

useCustomScrollPos();

function useVersionToast(releaseDate: ISODateString, changelogURI: string) {
  if (localStorage.getItem('release-date') != releaseDate) {
    localStorage.setItem('release-date', releaseDate);
    localStorage.setItem('release-toast', 'open');
  }

  const router = useRouter();
  const isNewRelease = useDate(releaseDate).toDaysOldFromNow() <= 13;
  const isToastClosed = ref(
    localStorage.getItem('release-toast') == 'closed' || !isNewRelease
  );
  const isToastHidden = ref(false);
  const isToastVisible = computed(() => {
    return isNewRelease && !isToastClosed.value && !isToastHidden.value;
  });

  function hideToastOnScroll() {
    if (isToastClosed.value) return;
    window.scrollY >= 40
      ? (isToastHidden.value = true)
      : (isToastHidden.value = false);
  }

  function openChangeLog() {
    closeToast();
    router.push(`/changelog/${changelogURI}`);
  }

  function closeToast() {
    isToastClosed.value = true;
    localStorage.setItem('release-toast', 'closed');
  }

  onMounted(() => {
    if (!isToastVisible.value) return;
    window.addEventListener('scroll', hideToastOnScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', hideToastOnScroll);
  });

  return {
    closeToast,
    openChangeLog,
    isToastVisible,
    isToastClosed,
  };
}

function useCustomScrollPos() {
  const router = useRouter();
  const route = useRoute();
  const cache = useDataCache<string>();
  const latestRoutes = cache.getArrayData('routeHistory');
  const managedPages: ManagedPages = [
    { scrollPos: ref(0), url: '/' },
    { scrollPos: ref(0), url: '/blog/public' },
    { scrollPos: ref(0), url: '/blog/red33m' },
    { scrollPos: ref(0), url: '/videos/public' },
    { scrollPos: ref(0), url: '/videos/red33m' },
    { scrollPos: ref(0), url: '/literature/public' },
    { scrollPos: ref(0), url: '/literature/red33m' },
    { scrollPos: ref(0), url: '/changelog' },
  ];

  history.scrollRestoration = 'manual';

  watch(() => route.path, onRouteChange);

  async function onRouteChange() {
    manageRouteHistory();
    await router.isReady();
    setScrollPos();
  }

  function setScrollPos() {
    const lastRoute = latestRoutes.value[0];
    const currentRoute = route.path;
    const currentPage = findManagedPage(currentRoute);
    const lastPage = findManagedPage(lastRoute);

    if (lastPage && !lastRoute.includes(`${currentRoute}/`)) {
      lastPage.scrollPos.value = window.scrollY;
    }

    // Sub-pages and un-managed pages
    if (currentRoute.includes(`${currentRoute}/`) || !currentPage) {
      scrollToTitlebar();
    } else {
      setScrollTop(currentPage.scrollPos.value);
    }
  }

  function findManagedPage(url: string) {
    return managedPages.find((page) => page.url.includes(url));
  }

  function scrollToTitlebar() {
    const ribbonHeight = 3;
    const headerHeight = document.getElementById('AppHeader')!.clientHeight;
    const toastBuffer = document.getElementById('ToastBuffer');
    setScrollTop(
      ribbonHeight + headerHeight + (toastBuffer ? toastBuffer.clientHeight : 0)
    );
  }

  function setScrollTop(top: number) {
    // Wait for transition to complete before scrolling
    setTimeout(() => {
      const maxTravel = window.innerHeight * 1.5;
      const behavior = window.scrollY - top > maxTravel ? 'auto' : 'smooth';
      window.scrollTo({ top, behavior });
      // DO NOT LOWER this delay
      // Unless you also adjust the page transition speed as well
      // TODO: grab delay from CSS variable
    }, 350);
  }

  /**
   * Maintain an artificial route history where the array data
   * `[lastPageURI, currentPageURI]` is saved inside the 'routeHistory'
   * cache location.
   */
  function manageRouteHistory() {
    const routeHistory = cache.getArrayData('routeHistory').value;
    if (!routeHistory.length) {
      cache.setArrayData('routeHistory', ['', route.path]);
    } else {
      cache.setArrayData('routeHistory', [routeHistory.pop(), route.path]);
    }
  }
}
</script>

<template>
  <div id="App" class="app__container">
    <div class="app__ribbon" />
    <div
      id="ToastBuffer"
      :class="['app__toast-buffer', { '--show': !isToastClosed }]"
    />
    <div
      :class="['app__toast', { '--show': isToastVisible }]"
      @click="openChangeLog"
    >
      Click here to see the New Release Changes!
      <ux-icon :type="'cross'" @click.stop="closeToast()" />
    </div>
    <header id="AppHeader" class="app__header">
      <router-link :to="{ name: 'home' }" class="title">
        Everything Explained
      </router-link>
    </header>
    <section class="app__body">
      <app-menu :header-id="'AppHeader'" :content-id="'AppBodyContent'" />
      <div id="AppBodyContent" class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
  </div>
</template>

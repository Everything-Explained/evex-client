

<script lang='ts' setup>
import { computed, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "./composeables/date";
import { ISODateString } from "./typings/global-types";
import AppMenu from "@/components/AppMenu.vue";
import UxIcon from "./components/UxIcon.vue";



type ManagedPages = Array<{ scrollPos: Ref<number>; url: string; }>;



const body = computed(() => document.body);
const {
  isToastVisible,
  isToastClosed,
  closeToast,
  openChangeLog,
} = useVersionToast(body, '2021-08-26T21:28:00.237Z', 'a4-blueprint');

useCustomScrollPos(body);


function useVersionToast(body: Ref<HTMLElement>, releaseDate: ISODateString, changelogURI: string) {
  if (localStorage.getItem('release-date') != releaseDate) {
    localStorage.setItem('release-date', releaseDate);
    localStorage.setItem('release-toast', 'open');
  }

  const router          = useRouter();
  const isNewRelease    = useDate(releaseDate).toDaysOldFromNow() <= 13;
  const isToastClosed   = ref(localStorage.getItem('release-toast') == 'closed' || !isNewRelease);
  const isToastHidden   = ref(false);
  const isToastVisible  = computed(() => {
    return isNewRelease && !isToastClosed.value && !isToastHidden.value;
  });

  function hideToastOnScroll() {
    if (isToastClosed.value) return;
    (body.value.scrollTop >= 40)
      ? isToastHidden.value = true
      : isToastHidden.value = false
    ;
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
    body.value.addEventListener('scroll', hideToastOnScroll);
  });

  onUnmounted(() => {
    body.value.removeEventListener('scroll', hideToastOnScroll);
  });

  return {
    closeToast,
    openChangeLog,
    isToastVisible,
    isToastClosed,
  };
}


function useCustomScrollPos(body: Ref<HTMLElement>) {
  const router          = useRouter();
  const route           = useRoute();
  const managedPages: ManagedPages = [
    { scrollPos: ref(0), url: '/blog'               },
    { scrollPos: ref(0), url: '/library/videos'     },
    { scrollPos: ref(0), url: '/library/literature' },
    { scrollPos: ref(0), url: '/red33m/literature'  },
    { scrollPos: ref(0), url: '/changelog'          },
  ];

  watch(() => route.path, onRouteChange);

  async function onRouteChange() {
    await router.isReady();
    checkForPages();
    setScrollTop(0);
  }

  function checkForPages() {
    for (const page of managedPages) {
      if (route.path.includes(page.url)) {
        setScrollPos(page.scrollPos, page.url);
        break;
      }
    }
  }

  function setScrollPos(posRef: Ref<number>, url: string) {
    // Look for sub-page
    if (route.path.includes(`${url}/`)) {
      posRef.value = body.value.scrollTop;
      setScrollTop(0); return;
    }
    setScrollTop(posRef.value);
  }

  function setScrollTop(top: number) {
    // Wait for transition to complete before scrolling
    setTimeout(() => body.value.scrollTop = top, 430);
  }
}

</script>





<template>
  <div id="App" class="app__container">
    <div class="app__ribbon" />
    <div :class="['app__toast-buffer', { '--show': !isToastClosed }]" />
    <div :class="['app__toast', { '--show': isToastVisible }]" @click="openChangeLog">
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










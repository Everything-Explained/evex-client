<template>
  <div id="App" class="app__container">
    <div class="app__ribbon" />
    <div :class="['app__toast-buffer', { '--show': !isToastClosed }]" />
    <div :class="['app__toast', { '--show': isToastVisible }]" @click="openChangeLog">
      Click here to see the New Release Changes!
      <ux-icon :type="'cross'" @click.stop="closeToast" />
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




<script lang='ts'>
import { computed, defineComponent, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDate } from "./composeables/date";
import { ISODateString } from "./typings/global-types";
// components
import TheMenuVue from "@/components/AppMenu.vue";
import uxIconVue from "./components/UxIcon.vue";

export default defineComponent({
  components: { 'app-menu': TheMenuVue, 'ux-icon': uxIconVue, },
  setup() {
    const body = computed(() => document.body);
    const {
      isToastVisible,
      isToastClosed,
      closeToast,
      openChangeLog,
    } = useVersionToast(body, '2021-07-07T00:58:57.144Z', 'a3-insulation');

    useCustomScrollPos(body);

    return { isToastVisible, isToastClosed, closeToast, openChangeLog };
  }
});


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
  const blogScrollPos   = ref(0);
  const libVidScrollPos = ref(0);
  const r3dLitScrollPos = ref(0);
  const blogURL         = '/blog';
  const libVidURL       = '/library/videos';
  const r3dLitURL       = '/red33m/literature';

  watch(() => route.path, onRouteChange);

  async function onRouteChange() {
    await router.isReady();
    if (route.path.includes(blogURL))   { setScrollPos(blogScrollPos, blogURL);     return; }
    if (route.path.includes(libVidURL)) { setScrollPos(libVidScrollPos, libVidURL); return; }
    if (route.path.includes(r3dLitURL)) { setScrollPos(r3dLitScrollPos, r3dLitURL); return; }
    setScrollTop(0);
  }

  function setScrollPos(posRef: Ref<number>, url: string) {
    // If navigating to sub-page
    if (route.path.includes(`${url}/`)) {
      posRef.value = body.value.scrollTop;
      setScrollTop(0); return;
    }
    setScrollTop(posRef.value);
  }

  function setScrollTop(top: number) {
    // Scrolls page after navigation transition delay
    setTimeout(() => body.value.scrollTop = top, 430);
  }
}


</script>




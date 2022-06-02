import { APIResponse, useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDataCache } from "@/state/cache-state";
import { computed } from "@vue/reactivity";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useURI } from "./URI";

export interface StaticPage {
  id: number;
  title: string;
  author: string;
  content: string;
  hash: string;
  date: string;
}

export function useStaticPager<T extends StaticPage>(url: DataCacheArrayKeys, version = '') {
  const router     = useRouter();
  const dataCache  = useDataCache<T>();
  const api        = useAPI();
  const route      = router.currentRoute;
  const activePage = ref<T|null>();
  const pageURI    = route.value.params.page as string|undefined;
  const pages      = dataCache.getArrayData(url);
  const pageTitle  = ref('');
  const error      = ref<APIResponse<string>|null>(null);
  const isGettingPageContent = ref(false);

  // Only retrieve pages when Cache is empty
  if (!pages.value.length) {
    api
      .get<StaticPage[]>(`/data/${url}`, null, version, 'static')
      .then(res => {
        dataCache.setArrayData(url, res.data);
        // If URL points to a specific page on load
        if (pageURI) displayPage(pageURI);
      })
      .catch((err: APIResponse<string>) => {
        error.value = err;
      })
    ;
  }

  // An edge case when navigating away from a custom
  // route, then backing the history to that same custom route.
  if (pages.value.length && pageURI) displayPage(pageURI);

  watch(() => route.value.params, onRouteChange);


  function onRouteChange(params: any) {
    if (!route.value.path.includes(url)) return;
    if (!params.page) {
      activePage.value = null;
      pageTitle.value = '';
      return;
    }
    displayPage(params.page as string);
  }


  function displayPage(uri: string) {
    const page = pages.value.find(page => useURI(page.title) == uri);

    if (!page) {
      router.push('/404');
      return;
    }

    pageTitle.value = page.title;

    if (page.content) {
      activePage.value = page;
      return;
    }

    isGettingPageContent.value = true;
    getPageContent(page);
  }


  function getPageContent(page: T) {
    api
      .get<string>(`/data/${url}/${page.id}.mdhtml`, null, page.hash, 'static', 'text')
      .then(res => {
        setTimeout(() => {
          page.content = res.data;
          activePage.value = page;
          isGettingPageContent.value = false;
        }, 500);
      });
  }


  function goTo(uri: string) {
    router.push(`/${url}/${uri}`);
    window.scrollTo(0, 0);
  }


  return {
    goTo,
    pages,
    activePage,
    pageTitle,
    error,
    isRunning: computed(() => api.isPending.value || isGettingPageContent.value),
  };
}
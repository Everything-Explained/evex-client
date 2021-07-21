import { useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDateCache } from "@/state/cache-state";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

export interface StaticPage {
  title: string;
  author: string;
  content: string;
  uri: string;
  date: string;
}

export function useStaticPager<T extends StaticPage>(url: DataCacheArrayKeys) {
  const router     = useRouter();
  const dataCache  = useDateCache<T>();
  const api        = useAPI();
  const route      = router.currentRoute;
  const activePage = ref<T|null>();
  const pageURI    = route.value.params.page as string|undefined;
  const pages      = dataCache.getArrayData(url);
  const pageTitle  = ref('');

  // Only retrieve pages when Cache is empty
  if (!pages.value.length) {
    api.get<StaticPage[]>(`/data/${url}.json`, null, 'static')
       .then(res => {
         dataCache.setArrayData(url, res.data);
          // If URL points to a specific page on load
          if (pageURI) displayPage(pageURI);
        })
    ;
  }

  // An edge case when navigating away from a custom
  // route, then backing the history to that same custom route.
  if (pages.value.length && pageURI) displayPage(pageURI);

  // onRouteChange
  watch(() => route.value.params,
    (params) => {
      if (!route.value.path.includes(url)) return;
      if (!params.page) {
        activePage.value = null;
        pageTitle.value = '';
        return;
      }
      displayPage(params.page as string);
    }
  );

  function displayPage(uri: string) {
    const page = pages.value.find(page => page.uri == uri);
    if (!page) { router.push('/404'); return; }
    activePage.value = page;
    pageTitle.value = page.title;
  }

  function goTo(uri: string) {
    router.push(`/${url}/${uri}`);
  }

  return {
    goTo,
    pages,
    activePage,
    pageTitle,
    isRunning: api.isPending,
  };
}
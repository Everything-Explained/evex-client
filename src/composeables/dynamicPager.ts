import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useURI } from './URI';

export type DynamicPage<T> = {
  title: string;
  uri: string;
  data: T | undefined;
};

type URIMap<T> = { [key: string]: DynamicPage<T> };

export function useDynamicPager<T>(
  url: string,
  param: string,
  cb?: (page?: DynamicPage<T>) => Promise<T | undefined>
) {
  const router = useRouter();
  const route = router.currentRoute;
  const currentURI = computed(() => route.value.params[param]);
  const pageMap = {} as URIMap<T>;
  const activePage = ref<DynamicPage<T>>();

  watch(() => route.value.params, onRouteChange);

  function onRouteChange(params: any) {
    if (!route.value.path.includes(url)) return;
    if (!params[param]) {
      activePage.value = undefined;
      return;
    }
    if (currentURI.value) setActivePage();
  }

  function setDynPages(pages: { name: string; data: T }[]) {
    pages.forEach((page) => {
      pageMap[page.name] = {
        title: page.name,
        uri: useURI(page.name),
        data: page.data,
      };
    });
    // If route is already pointing to page
    if (currentURI.value) setActivePage();
  }

  async function setActivePage() {
    const activePageObj = Object.values(pageMap).find(
      (p) => p.uri == currentURI.value
    );
    if (!activePageObj) {
      router.push('/404');
      return;
    }
    if (cb) {
      activePageObj.data = await cb(activePageObj);
    }
    activePage.value = activePageObj;
  }

  function goTo(pageName: string) {
    const currentPage = pageMap[pageName];
    if (!currentPage) {
      router.push('/404');
      throw Error(`dynamicPager()::Missing or Invalid Page Name "${pageName}"`);
    }
    router.push(`/${url}/${pageMap[pageName].uri}`);
    activePage.value = currentPage;
  }

  return { setDynPages, goTo, activePage };
}

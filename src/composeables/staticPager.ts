import { APIResponse, useAPI } from '@/services/api_internal';
import { DataCacheArrayKeys, useDataCache } from '@/state/cache-state';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { DynamicPage, useDynamicPager } from './dynamicPager';

export interface StaticPage {
  id: number;
  title: string;
  author: string;
  content: string;
  hash: string;
  date: string;
}

interface PageContent {
  title: string;
  hash: string;
  data: string;
}

export function useStaticPager<T extends StaticPage>(
  url: DataCacheArrayKeys,
  version = ''
) {
  const dataCache = useDataCache<T>();
  const contentCache = useDataCache<PageContent>();
  const api = useAPI();
  const pages = dataCache.getArrayData(url);
  const pageContentStore = contentCache.getArrayData('page-content').value;
  const error = ref<APIResponse<string> | null>(null);

  const { goTo, setDynPages, activePage, hasURI, pageTitle } =
    useDynamicPager<string>(url, 'page', useRouter(), getPageContent);

  // Only retrieve pages when Cache is empty
  if (pages.value.length) {
    setDynPages(pages.value.map((p) => ({ name: p.title, data: '' })));
  } else {
    api
      .get<StaticPage[]>(`/data/${url}`, null, version, 'static')
      .then((res) => {
        dataCache.setArrayData(url, res.data);
        setDynPages(res.data.map((d) => ({ name: d.title, data: '' })));
      })
      .catch((err: APIResponse<string>) => {
        error.value = err;
      });
  }

  async function getPageContent(
    pageRef?: DynamicPage<string>
  ): Promise<string | undefined> {
    if (!pageRef) return undefined;
    const page = pages.value.find((p) => p.title == pageRef.title);
    if (!page) return undefined;

    const cachedContent = pageContentStore.find((p) => p.hash == page.hash);
    const pageContent =
      cachedContent ??
      (await api.get<string>(
        `/data/${url}/${page.id}.mdhtml`,
        null,
        page.hash,
        'static',
        'text'
      ));
    if (!cachedContent) {
      pageContentStore.push({
        title: page.title,
        hash: page.hash,
        data: pageContent.data,
      });
      contentCache.setArrayData('page-content', pageContentStore);
    }
    return pageContent.data;
  }

  return {
    goTo,
    pages,
    activePage,
    pageTitle,
    error,
    hasURI,
    isRunning: api.isPending,
  };
}

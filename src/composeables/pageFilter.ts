
import { DataCacheFilterObj, useDataCache } from "@/state/cache-state";
import { ref } from "vue";


export interface FilterData {
  // Allow ignorable props
  [key: string]: any;
  author: string;
  date: string;
}


export function usePageFilter(pages: FilterData[], isPersisting: boolean, areReversed = false) {
  const cache            = useDataCache<DataCacheFilterObj>();
  const filterStore      = cache.getObjData('filter').value;
  const clonedPages      = pages.slice();
  const authors          = getAuthors(clonedPages);
  const isFilterOpen     = ref(filterStore.isPersisting && filterStore.isOpen || false);
  const areItemsReversed =
    filterStore.isPersisting
      ? areReversed ? !filterStore.reversed : filterStore.reversed
      : areReversed
  ;
  const authorIndexMap   =
    filterStore.isPersisting
      ? filterStore.authorIndexMap
      : authors.map((a, i) => i)
  ;
  let filteredPages      =
    filterStore.isPersisting
      ? filterStore.pages
      : clonedPages.slice()
  ;

  if (filterStore.isPersisting && filterStore.reversed) {
    clonedPages.reverse();
  }

  cache.updObjData('filter', 'isPersisting', isPersisting);
  cache.updObjData('filter', 'authorIndexMap', authorIndexMap);
  cache.updObjData('filter', 'pages', filteredPages);

  return {
    toggleFilter: () => {
      isFilterOpen.value = !isFilterOpen.value;
      cache.updObjData('filter', 'isOpen', isFilterOpen.value);
    },

    reversePages: () => {
      // Original pages must also reflect reverse order
      clonedPages.reverse();
      const pages = filteredPages.reverse().slice();
      cache.updObjData('filter', 'reversed', !cache.getObjData('filter').value.reversed);
      return pages;
    },

    filterAuthor: (index: number, val: boolean) => {
      if (val)  authorIndexMap.push(index);
      if (!val) authorIndexMap.splice(authorIndexMap.indexOf(index), 1)
      ;
      cache.updObjData('filter', 'authorIndexMap', authorIndexMap);
      filteredPages = clonedPages.filter(item => {
        return authorIndexMap.some(i => authors[i] == item.author);
      });
      cache.updObjData('filter', 'pages', filteredPages);
      return filteredPages;
    },

    authors,
    isFilterOpen,
    filteredPages,
    authorIndexMap,
    areItemsReversed,
  };
}



function getAuthors(pages: FilterData[]) {
  return pages.reduce((authors, cpg) => {
    if (authors.includes(cpg.author)) return authors;
    authors.push(cpg.author);         return authors;
  }, [] as string[]);
}
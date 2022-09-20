import { useDataCache } from '@/state/cache-state';
import { ref } from 'vue';

export interface FilterCacheData {
  id: string;
  items: FilterData[];
  isOpen: boolean;
  reversed: boolean;
  authors: string[];
  authorIndexMap: number[];
  volatile: boolean;
}

export interface FilterData {
  // Allow ignorable props
  [key: string]: any;
  author: string;
  date: string;
}

type FilterConfig = {
  areReversed?: boolean;
  isVolatile?: boolean;
};

export function usePageFilter(
  id: string,
  items: FilterData[],
  config: FilterConfig
) {
  const cache = useDataCache<FilterCacheData>();
  const filterArray = cache.getArrayData('ux-filter');
  const clonedItems = items.slice();
  const areReversed = config.areReversed ?? false;
  const isVolatile = config.isVolatile ?? true;
  const filterData = tryCreateData();
  const isFilterOpen = ref(filterData.isOpen);
  const isFilterReversed = filterData.reversed;
  const authorIndexMap = filterData.authorIndexMap;
  const authors = filterData.authors;

  // Items from parent are always in order from oldest => latest
  if (filterData.reversed) {
    clonedItems.reverse();
  }

  return {
    isFilterOpen,
    isFilterReversed,
    filteredItems: filterData.items,
    authors,
    authorIndexMap,

    toggleFilter: () => {
      isFilterOpen.value = !isFilterOpen.value;
      filterData.isOpen = isFilterOpen.value;
    },

    reverseItems: () => {
      clonedItems.reverse();
      filterData.items.reverse();
      filterData.reversed = !filterData.reversed;
      //* Slice (new object) so Vue knows to update Ref
      return filterData.items.slice();
    },

    filterAuthor: (index: number, val: boolean) => {
      if (val) authorIndexMap.push(index);
      if (!val) authorIndexMap.splice(authorIndexMap.indexOf(index), 1);

      filterData.items = clonedItems.filter((item) => {
        return authorIndexMap.some((i) => authors[i] == item.author);
      });
      //* Slice (new object) so Vue knows to update Ref
      return filterData.items.slice();
    },
  };

  function tryCreateData() {
    const data = filterArray.value.find((d) => d.id == id);
    // Clear volatile entries
    cache.setArrayData(
      'ux-filter',
      filterArray.value.filter((v) => v.volatile == false || data?.id == v.id)
    );

    if (data) {
      return data;
    }

    const authors = getAuthors();
    const newData: FilterCacheData = {
      id,
      // Items from parent are always in order from oldest => latest
      items: areReversed ? items.slice().reverse() : items.slice(),
      isOpen: false,
      reversed: areReversed,
      authors,
      authorIndexMap: authors.map((a, i) => i),
      volatile: isVolatile,
    };
    filterArray.value.push(newData);
    cache.setArrayData('ux-filter', filterArray.value);
    return newData;
  }

  function getAuthors() {
    return items.reduce((authors, cpg) => {
      if (authors.includes(cpg.author)) {
        return authors;
      }
      authors.push(cpg.author);
      return authors;
    }, [] as string[]);
  }
}

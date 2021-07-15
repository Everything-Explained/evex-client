<template>
  <div class="ee-filter">
    <fieldset :class="['ee-filter__fieldset', { '--visible': isFilterOpen }]">
      <legend>Filter</legend>
      <ux-toggle
        :init-state="areItemsReversed"
        left-text="Oldest"
        right-text="Latest"
        @toggle="toggleAge"
      />
      <div class="ee-filter__authors">
        <ux-checkbox
          v-for="(author, i) of authors"
          :key="i"
          :value="author"
          :checked="authorIndexMap.includes(i)"
          @changed="filter(i, $event)"
        />
      </div>
    </fieldset>
    <div
      v-if="!ageOnly"
      class="ee-filter__expand-filter"
      @mousedown="toggleFilter"
    >
      <span v-if="isFilterOpen">
        <ux-icon type="chev-up" />
        less
      </span>
      <span v-else>
        <ux-icon type="chev-down" />
        more
      </span>
    </div>
  </div>
</template>




<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { DataCacheFilterObj, useDateCache } from "@/state/cache-state";
import { useEventBus } from "@/state/event-bus";
// Components
import uxCheckboxVue  from "../UxCheckbox.vue";
import uxIconVue      from "../UxIcon.vue";
import uxToggleVue    from "../UxToggle.vue";

interface FilterData {
  // Allow ignorable props
  [key: string]: any;
  author: string;
  date: string;
}

export default defineComponent({
  components: {
    'ux-checkbox' : uxCheckboxVue,
    'ux-toggle'   : uxToggleVue,
    'ux-icon'     : uxIconVue,
  },
  props: {
    ageOnly:      { type: Boolean as PropType<boolean>,    default: false,             },
    reverseOrder: { type: Boolean as PropType<boolean>,    default: false,             },
    items:        { type: Array as PropType<FilterData[]>, default: [] as FilterData[] },
    persist:      { type: Boolean as PropType<boolean>,    default: true               },
  },
  emits: ['filter'],
  setup({items, persist, reverseOrder}, {emit}) {
    const isChecked        = ref([]);
    const eventBus         = useEventBus();

    const {
      toggleFilter,
      filterAuthor,
      reversePages,
      authors,
      isFilterOpen,
      areItemsReversed,
      filteredPages,
      authorIndexMap,
    } = usePageFilter(items, persist, reverseOrder);

    emit('filter', filteredPages);

    return {
      filter: (i: number, v: boolean) => {
        emit('filter', filterAuthor(i, v));
        eventBus.emit('update-footer');
      },

      toggleAge: () => {
        emit('filter', reversePages());
      },

      isChecked,
      authors,
      isFilterOpen,
      areItemsReversed,
      authorIndexMap,
      toggleFilter,
    };
  }
});



function usePageFilter(pages: FilterData[], isPersisting: boolean, areReversed = false) {
  const cache            = useDateCache<DataCacheFilterObj>();
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
      cache.updObjData('filter', 'reversed', !filterStore.reversed);
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


</script>




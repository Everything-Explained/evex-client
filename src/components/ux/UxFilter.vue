<script lang="ts" setup>
import { PropType, ref } from 'vue';
import UxCheckbox from '@/components/ux/UxCheckbox.vue';
import UxIcon from '@/components/ux/UxIcon.vue';
import UxToggle from '@/components/ux/UxToggle.vue';
import { useDataCache } from '@/state/cache-state';

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

const props = defineProps({
  id: { type: String as PropType<string>, required: true },
  ageOnly: { type: Boolean as PropType<boolean>, default: false },
  isVolatile: { type: Boolean as PropType<boolean>, default: true },
  reverseOrder: { type: Boolean as PropType<boolean>, default: false },
  items: { type: Array as PropType<FilterData[]>, default: [] as FilterData[] },
});
const emit = defineEmits(['filter', 'age-toggled']);

const cache = useDataCache<FilterCacheData>();
const filterArray = cache.getArrayData('ux-filter');
const clonedItems = props.items.slice();
const areReversed = props.reverseOrder ?? false;
const isVolatile = props.isVolatile ?? true;
const filterData = tryCreateData();
const isFilterOpen = ref(filterData.isOpen);
const isFilterReversed = filterData.reversed;
const authorIndexMap = filterData.authorIndexMap;
const authors = filterData.authors;

// Items from parent are always in order from oldest => latest
if (filterData.reversed) {
  clonedItems.reverse();
}

function tryCreateData() {
  const data = filterArray.value.find((d) => d.id == props.id);
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
    id: props.id,
    // Items from parent are always in order from oldest => latest
    items: areReversed ? props.items.slice().reverse() : props.items.slice(),
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
  return props.items.reduce((authors, cpg) => {
    if (authors.includes(cpg.author)) {
      return authors;
    }
    authors.push(cpg.author);
    return authors;
  }, [] as string[]);
}

function filterAuthor(index: number, val: boolean) {
  if (val) authorIndexMap.push(index);
  if (!val) authorIndexMap.splice(authorIndexMap.indexOf(index), 1);

  filterData.items = clonedItems.filter((item) => {
    return authorIndexMap.some((i) => authors[i] == item.author);
  });
  //* Slice (new object) so Vue knows to update Ref
  return filterData.items.slice();
}

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value;
  filterData.isOpen = isFilterOpen.value;
}

function reverseItems() {
  clonedItems.reverse();
  filterData.items.reverse();
  filterData.reversed = !filterData.reversed;
  //* Slice (new object) so Vue knows to update Ref
  return filterData.items.slice();
}

emit('filter', filterData.items);

function filter(i: number, v: boolean) {
  emit('filter', filterAuthor(i, v));
}

function toggleAge() {
  emit('age-toggled');
  emit('filter', reverseItems());
}
</script>

<template>
  <div class="ux-filter">
    <fieldset :class="['ux-filter__fieldset', { '--visible': isFilterOpen }]">
      <legend>Filter</legend>
      <ux-toggle
        :init-state="isFilterReversed"
        left-text="Oldest"
        right-text="Latest"
        @toggle="toggleAge"
      />
      <div class="ux-filter__authors">
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
      class="ux-filter__expand-filter"
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

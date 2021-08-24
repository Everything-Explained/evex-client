<template>
  <div class="ux-filter">
    <fieldset :class="['ux-filter__fieldset', { '--visible': isFilterOpen }]">
      <legend>Filter</legend>
      <ux-toggle
        :init-state="areItemsReversed"
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





<script lang="ts" setup>
import { PropType, defineProps, defineEmits } from "vue";
import { useEventBus } from "@/state/event-bus";
import { FilterData, usePageFilter } from "@/composeables/pageFilter";
import UxCheckbox  from "./UxCheckbox.vue";
import UxIcon      from "./UxIcon.vue";
import UxToggle    from "./UxToggle.vue";


const { items, persist, reverseOrder }
                = defineProps({
  ageOnly:      { type: Boolean as PropType<boolean>,    default: false,             },
  reverseOrder: { type: Boolean as PropType<boolean>,    default: false,             },
  items:        { type: Array as PropType<FilterData[]>, default: [] as FilterData[] },
  persist:      { type: Boolean as PropType<boolean>,    default: true               },
});
const emit      = defineEmits(['filter']);
const eventBus  = useEventBus();

const {
  toggleFilter,  filterAuthor,  reversePages,
  authors,       isFilterOpen,  areItemsReversed,
  filteredPages, authorIndexMap,
} = usePageFilter(items, persist, reverseOrder);

emit('filter', filteredPages);

function filter(i: number, v: boolean) {
  emit('filter', filterAuthor(i, v)), eventBus.updateFooter();
}

function toggleAge() { emit('filter', reversePages()); }

</script>




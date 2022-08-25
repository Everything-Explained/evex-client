

<script lang="ts" setup>
import { PropType } from "vue";
import { FilterData, usePageFilter } from "@/composeables/pageFilter";
import UxCheckbox  from "./UxCheckbox.vue";
import UxIcon      from "./UxIcon.vue";
import UxToggle    from "./UxToggle.vue";


const { id, items, reverseOrder, isVolatile }
                = defineProps({
  id:           { type: String as PropType<string>,      required: true              },
  ageOnly:      { type: Boolean as PropType<boolean>,    default: false,             },
  isVolatile:   { type: Boolean as PropType<boolean>,    default: true,              },
  reverseOrder: { type: Boolean as PropType<boolean>,    default: false,             },
  items:        { type: Array as PropType<FilterData[]>, default: [] as FilterData[] },
});
const emit      = defineEmits(['filter', 'age-toggled']);

const {
  toggleFilter,  filterAuthor,  reverseItems,
  authors,       isFilterOpen,  isFilterReversed,
  filteredItems, authorIndexMap,
} = usePageFilter(id, items, { areReversed: reverseOrder, isVolatile,  });

emit('filter', filteredItems);

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









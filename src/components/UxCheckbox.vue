

<script lang="ts" setup>
import useUniqueIDGen from "@/composeables/uniqueID";
import { PropType } from "@vue/runtime-core";


defineProps({
  value:   { type: String  as PropType<string>,  required: true },
  checked: { type: Boolean as PropType<boolean>, default: false },
});

const emit    = defineEmits(['update:modelValue', 'changed']);
const genID   = useUniqueIDGen().genID;
const getVal  = (e: Event) => (e.target as HTMLInputElement).checked;
const chkbxID = genID();

</script>





<template>
  <div class="ux-checkbox__container">
    <input
      :id="chkbxID"
      class="ux-checkbox"
      type="checkbox"
      :checked="checked"
      @change="emit('changed', getVal($event)), emit('update:modelValue', getVal($event))"
    >
    <label :for="chkbxID" class="ux-checkbox__label">
      <div class="ux-checkbox__box">
        <svg class="ux-checkbox__checkmark" viewbox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </div>
      <div class="ux-checkbox__author">{{ value }}</div>
    </label>
  </div>
</template>











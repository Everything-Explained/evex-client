<template>
  <span :class="['form__error',{ '--show': showError}, customClass]">
    {{ text }}
  </span>
</template>



<script lang='ts' setup>
import { ref, watch, defineProps } from "@vue/runtime-core";

const props        = defineProps({
  update : { type: Number,  default: 0              },
  text   : { type: String,  default: 'Default Text' },
  class  : { type: String,  default: ''             },
});
const showError   = ref(false);
const customClass = props.class;

let timeout = 0;
function toggleError() {
  clearTimeout(timeout);
  showError.value = true;
  timeout = setTimeout(() => { showError.value = false; }, 2000);
}

watch(() => props.update, toggleError);

</script>



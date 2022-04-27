<template>
  <div class="onoff-switch input-switch" @click="callback()">
    <input type="checkbox" :checked="state">
    <span class="switch-text-off">OFF</span>
    <span class="slider" />
    <span class="switch-text-on">ON</span>
  </div>
</template>





<script lang="ts" setup>
import { ref } from "vue";


const {callback} = defineProps({
  callback: { type: Function, required: true },
});
const state      = ref(false);

function toggle() {
  state.value = !state.value;
  callback(state.value);
}

</script>


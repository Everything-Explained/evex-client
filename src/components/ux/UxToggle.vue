<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  initState: { type: Boolean, default: false },
  leftText: { type: String, default: 'Left' },
  rightText: { type: String, default: 'Right' },
  prevent: { type: Boolean, default: false },
});
const emit = defineEmits(['toggle']);
const state = ref(props.initState);

function toggle(val: boolean) {
  if (props.prevent) return;
  if (val == state.value) return;
  state.value = val;
  emit('toggle', state.value);
}
</script>

<template>
  <div class="ux-toggle">
    <input
      id="toggleLeft"
      class="ux-toggle__input"
      type="radio"
      name="toggle"
      :checked="!state"
      :disabled="prevent"
    />
    <label
      :class="['ux-toggle__label', { '--wait': prevent }]"
      for="toggleLeft"
      @click="toggle(false)"
      >{{ leftText }}</label
    >
    <input
      id="toggleRight"
      class="ux-toggle__input"
      type="radio"
      name="toggle"
      :checked="state"
      :disabled="prevent"
    />
    <label
      :class="['ux-toggle__label', { '--wait': prevent }]"
      for="toggleRight"
      @click="toggle(true)"
      >{{ rightText }}</label
    >
  </div>
</template>

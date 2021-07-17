<template>
  <div class="ux-toggle">
    <input
      id="toggleLeft"
      class="ux-toggle__input"
      type="radio"
      name="toggle"
      :checked="!state"
      :disabled="props.prevent"
    >
    <label
      :class="['ux-toggle__label', { '--wait': props.prevent }]"
      for="toggleLeft"
      @click="toggle(false)"
    >{{ leftText }}</label>
    <input
      id="toggleRight"
      class="ux-toggle__input"
      type="radio"
      name="toggle"
      :checked="state"
      :disabled="props.prevent"
    >
    <label
      :class="['ux-toggle__label', { '--wait': props.prevent }]"
      for="toggleRight"
      @click="toggle(true)"
    >{{ rightText }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    initState : { type: Boolean,  default: false         },
    leftText  : { type: String,   default: 'Left'        },
    rightText : { type: String,   default: 'Right'       },
    prevent   : { type: Boolean,  default: false         },
  },
  emits: ['toggle'],
  setup(props, {emit}) {
    const state = ref(props.initState);

    const toggle = (val: boolean) => {
      if (props.prevent) return;
      if (val == state.value) return;
      state.value = val;
      emit('toggle', state.value);
    };

    return { state, toggle, props };
  }
});
</script>
<template>
  <button
    :class="['ux-button', theme, { '--loading': loading }]"
    :type="undefined"
    :disabled="isDisabled"
  >
    <slot />
  </button>
</template>





<script lang='ts' setup>
import { computed, defineProps } from "vue";


const _buttonThemes = ['neutral', 'attention', 'dangerous'];

const props = defineProps({
  theme:    { type: String,  default: 'neutral' },
  loading:  { type: Boolean, default: false,    },
  disabled: { type: Boolean, default: false,    },
});

if (!_buttonThemes.includes(props.theme))
  throw Error(`ee-button:: invalid button type ${props.theme}`)
;

const isDisabled = computed(() => {
  // Prevent clicks when loading
  return props.loading || props.disabled;
});

</script>
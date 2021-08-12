<template>
  <div class="ux-icon" v-html="icon" />
</template>





<script lang='ts' setup>
import { computed, defineProps, PropType, toRef } from 'vue';


type StringMap = { [key: string]: string };


const props  = defineProps({
  type: { type: String as PropType<keyof typeof iconMap>, required: true }
});
const type   = toRef(props, 'type');
const iconMap: StringMap = {
  'clock'      : 'Y',
  'calendar'   : 'M',
  'checkmark'  : 'S',
  'cross'      : '9',
  'gear'       : '~',
  'chev-up'    : 'W',
  'chev-down'  : 'T',
  'chev-right' : 'V',
  'chev-left'  : 'U',
  'log-in'     : '<',
  'log-out'    : '=',
  'doc'        : 'y',
  'dots'       : '/',
  'export'     : '[',
  'info'       : '&#xe009',
  'heart'      : '&#xe004',
  'home'       : '&#xe006',
  'mail'       : '&#xe015',
  'menu'       : '&#xe020',
  'star'       : '&#xe045',
  'thumb-up'   : '&#xe04e',
  'thumb-down' : '&#xe04d',
  'trash'      : '&#xe053',
  'user'       : '&#xe056',
};

if (!iconMap[type.value])
  throw Error(`<ux-icon>::invalid icon type: ${type.value}`)
;

const icon = computed(() => iconMap[type.value]);

</script>



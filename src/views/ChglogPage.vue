<template><app-literature :options="options" /></template>





<script lang='ts' setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";
import { useAPI } from "@/services/api_internal";


const options: AppLitOptions = {
  uri               : 'changelog',
  title             : 'Changelog',
  expanded          : true,
  showAuthor        : false,
  showFilter        : false,
  useCustomRenderer : false,
  contentClass      : 'vw-chglog',
  version           : useAPI().state.versions?.libLit
};

</script>


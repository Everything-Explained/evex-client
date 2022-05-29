

<script lang='ts' setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";
import { useAPI } from "@/services/api_internal";


const options: AppLitOptions = {
  uri          : 'blog',
  title        : 'Blog Entries',
  expanded     : true,
  reverseOrder : true,
  version      : useAPI().state.versions?.blog.v,
};

</script>





<template><app-literature :options="options" /></template>








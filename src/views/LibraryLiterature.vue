<template><app-literature :options="options" /></template>





<script lang="ts" setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";


const options: AppLitOptions = {
  uri   : 'library/literature',
  title : 'Library Literature'
};

</script>



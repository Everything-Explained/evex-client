

<script lang="ts" setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";
import { useAPI } from "@/services/api_internal";


const options: AppLitOptions = {
  uri   : 'library/literature',
  title : 'Library Literature',
  version : useAPI().state?.versions?.libLit.v
};

</script>





<template><app-literature :options="options" /></template>









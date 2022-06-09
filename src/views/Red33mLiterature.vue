

<script lang="ts" setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";
import { useAPI } from "@/services/api_internal";


const options: AppLitOptions = {
  uri   : 'literature/red33m',
  title : 'RED33M Literature',
  version : useAPI().state.versions?.r3dLit.v
};

</script>





<template>
  <div class="red-lit">
    <app-literature :options="options" />
  </div>
</template>









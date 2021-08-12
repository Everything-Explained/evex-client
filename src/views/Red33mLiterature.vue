<template>
  <div class="red-lit">
    <app-literature :options="options" />
  </div>
</template>





<script lang="ts" setup>
import AppLiterature, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";


const options: AppLitOptions = {
  uri   : 'red33m/literature',
  title : 'RED33M Literature',
};

</script>



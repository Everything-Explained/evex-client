<template>
  <app-literature
    title="Library Literature"
    uri="library/literature"
  />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import AppLiteratureVue from "@/components/AppLiterature.vue";


export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, }
});
</script>
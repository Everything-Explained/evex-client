<template>
  <literature-page
    title="Library Literature"
    uri="library/literature"
  />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import LiteraturePageVue from "@/components/LiteraturePage.vue";


export default defineComponent({
  components: { 'literature-page': LiteraturePageVue, }
});
</script>
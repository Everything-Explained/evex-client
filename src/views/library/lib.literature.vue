<template>
  <ee-literature
    title="Library Literature"
    uri="library/literature"
  />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/model/LiteraturePage.vue";


export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, }
});
</script>
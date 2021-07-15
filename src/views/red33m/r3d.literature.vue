<template>
  <literature-page
    title="RED33M Literature"
    uri="red33m/literature"
  />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import LiteraturePageVue from "@/components/model/LiteraturePage.vue";


export default defineComponent({
  components: { 'literature-page': LiteraturePageVue, }
});
</script>
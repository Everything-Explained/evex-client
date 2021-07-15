<template>
  <literature-page
    title="Blog Entires"
    size="expanded"
    :show-date-time="true"
    :reverse-order="true"
    uri="blog"
  />
</template>



<script lang='ts'>
import { defineComponent } from "vue"
;
import LiteraturePageVue from "@/components/LiteraturePage.vue";


export default defineComponent({
  components: { 'literature-page': LiteraturePageVue, },
});
</script>


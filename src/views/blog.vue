<template>
  <app-literature
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
import AppLiteratureVue from "@/components/AppLiterature.vue";


export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, },
});
</script>


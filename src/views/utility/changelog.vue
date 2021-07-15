<template>
  <literature-page
    uri="changelog"
    size="expanded"
    :show-date-time="true"
    :show-author="false"
    :show-filter="false"
    :use-custom-renderer="false"
    content-class="chglog"
    title="Changelog"
  />
</template>

<script lang='ts'>
import LiteraturePageVue from "@/components/LiteraturePage.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 'literature-page': LiteraturePageVue, },
});
</script>


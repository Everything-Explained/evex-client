<template>
  <app-literature
    uri="changelog"
    size="expanded"
    :show-date-time="true"
    :show-author="false"
    :show-filter="false"
    :use-custom-renderer="false"
    content-class="vw-chglog"
    title="Changelog"
  />
</template>

<script lang='ts'>
import AppLiteratureVue from "@/components/AppLiterature.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, },
});
</script>


<template>
  <app-literature :options="options" />
</template>

<script lang='ts'>
import AppLiteratureVue, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, },
  setup() {
    const options: AppLitOptions = {
      uri: 'changelog',
      title: 'Changelog',
      expanded: true,
      showAuthor: false,
      showFilter: false,
      useCustomRenderer: false,
      contentClass: 'vw-chglog',
    };

    return { options };
  }
});
</script>


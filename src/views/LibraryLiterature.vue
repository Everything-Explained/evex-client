<template>
  <app-literature :options="options" />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import AppLiteratureVue, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";


export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, },
  setup() {
    const options: AppLitOptions = {
      uri: 'library/literature',
      title: 'Library Literature'
    };

    return { options };
  }
});
</script>
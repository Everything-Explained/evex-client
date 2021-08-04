<template>
  <div class="red-lit">
    <app-literature :options="options" />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import AppLiteratureVue, { AppLitOptions } from "@/components/AppLiterature/AppLiterature.vue";


export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, },
  setup() {
    const options: AppLitOptions = {
      uri: 'red33m/literature',
      title: 'RED33M Literature',
    };
    return { options };
  }
});
</script>
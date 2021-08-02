<template>
  <div class="red-lit">
    <app-literature
      title="RED33M Literature"
      uri="red33m/literature"
    />
  </div>
</template>


<script lang="ts">
import './styles/red33m-literature.css';
import { defineComponent } from "vue"
;
import AppLiteratureVue from "@/components/AppLiterature.vue";


export default defineComponent({
  components: { 'app-literature': AppLiteratureVue, }
});
</script>
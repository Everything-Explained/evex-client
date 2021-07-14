<template>
  <div class="r3d-lit">
    <ee-literature
      title="RED33M Literature"
      uri="red33m/literature"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/model/LiteraturePage.vue";


export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, }
});
</script>
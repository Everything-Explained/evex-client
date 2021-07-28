<template>
  <div class="container">
    <pg-titlebar>About Us</pg-titlebar>
    <app-md v-html="content" />
    <pg-footer />
  </div>
</template>



<script lang='ts'>
import mdHomePages from '../../release/web_client/_data/home.json';
import { defineComponent } from "vue"
;
import PageTitlebarVue from '@/components/PageTitlebar.vue';
import PageFooterVue from '@/components/PageFooter.vue';
import AppMarkdownVue from '@/components/AppMarkdown.vue';



export default defineComponent({
  components: { 'pg-titlebar': PageTitlebarVue, 'pg-footer': PageFooterVue, 'app-md': AppMarkdownVue },
  setup() { return { content: mdHomePages[0].content }; }
});
</script>
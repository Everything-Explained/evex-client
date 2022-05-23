<template>
  <div class="container">
    <page-titlebar>About Us</page-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="pageContent" class="content">
        <app-markdown v-html="pageContent" />
        <page-footer />
      </div>
      <ux-preloader v-else />
    </transition>
  </div>
</template>






<script lang='ts' setup>
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter   from '@/components/PageFooter.vue';
import AppMarkdown  from '@/components/AppMarkdown.vue';
import { useAPI } from '@/services/api_internal';
import { ref } from 'vue';
import UxPreloader from '@/components/UxPreloader.vue';

const api = useAPI();
const pageContent = ref('');

api
  .get<any>('/data/static/home.json', null, api.state.versions?.home.v)
  .then(res => {
    pageContent.value = res.data.content;
  });

</script>



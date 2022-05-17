<template>
  <div class="container">
    <page-titlebar>About Us</page-titlebar>
    <app-markdown v-html="content" />
    <page-footer />
  </div>
</template>






<script lang='ts' setup>
import mdHomePage   from '../../release/web_client/_data/home.json';
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter   from '@/components/PageFooter.vue';
import AppMarkdown  from '@/components/AppMarkdown.vue';


const content = mdHomePage[0].content;
</script>



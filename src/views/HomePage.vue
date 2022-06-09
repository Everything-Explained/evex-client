<template>
  <div class="container">
    <page-titlebar>About Us</page-titlebar>
    <transition name="fade" mode="out-in">
      <div v-if="pageContent" class="content">
        <render-html :html="pageContent" />
        <page-footer />
      </div>
      <ux-preloader v-else />
    </transition>
  </div>
</template>






<script lang='ts' setup>
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter   from '@/components/PageFooter.vue';
import RenderHtml   from '@/components/RenderHtml.vue';
import { useAPI } from '@/services/api_internal';
import { ref } from 'vue';
import UxPreloader from '@/components/UxPreloader.vue';
import { useDataCache } from '@/state/cache-state';

const api = useAPI();
const cache = useDataCache<string>();
const homePageCache = cache.getData('home-page');
const pageContent = ref('');

if (homePageCache) {
  pageContent.value = homePageCache.value;
}
else {
  api
    .get<any>('/data/standalone/home.json', null, api.state.versions?.home.v, 'static')
    .then(res => {
      cache.setData('home-page', res.data.content);
      pageContent.value = res.data.content;
    });
}

</script>



<template>
  <div class="lit">
    <page-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isRunning || isGettingPageContent" />
      <page-error v-else-if="apiError" class="error">
        {{ apiError.data }}<br>
        Try again later...
      </page-error>
      <div v-else-if="!activePage" class="lit-cards__container">
        <ux-filter
          v-if="cfg.showFilter"
          :items="pages"
          :reverse-order="cfg.reverseOrder"
          @filter="onFilter"
        />
        <app-lit-cards
          :cards="filteredPages"
          :go-to="goTo"
          :show-author="cfg.showAuthor"
          :expanded="cfg.expanded"
        />
        <page-footer />
      </div>
      <div v-else-if="activePage">
        <render-html v-if="cfg.useCustomRenderer" :html="activePage.content" />
        <app-markdown
          v-else
          :simple="false"
          :class="cfg.contentClass"
          v-html="activePage.content"
        />
        <page-footer />
      </div>
    </transition>
  </div>
</template>





<script lang="ts" setup>
import { computed, onUnmounted, PropType, ref, watch } from "vue";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import { DataCacheArrayKeys, DataCacheFilterObj, useDataCache } from "@/state/cache-state";
import PageTitlebar from "@/components/PageTitlebar.vue";
import PageFooter   from "../PageFooter.vue";
import RenderHtml   from "../RenderHtml.vue";
import UxFilter     from "../UxFilter.vue";
import UxPreloader  from '../UxPreloader.vue';
import AppMarkdown  from "../AppMarkdown.vue";
import AppLitCards  from "./AppLitCards.vue";
import PageError    from '../PageError.vue';


export interface Article extends StaticPage {
  summary: string;
}

export interface AppLitOptions {
  uri               : DataCacheArrayKeys;
  title             : string;
  showFilter        ?: boolean;
  expanded          ?: boolean;
  reverseOrder      ?: boolean;
  showAuthor        ?: boolean;
  useCustomRenderer ?: boolean;
  contentClass      ?: string;
  version           ?: string;
}


const {options} = defineProps({
  options: { type: Object as PropType<AppLitOptions>, required: true }
});

const defaultOptions: AppLitOptions = {
  uri               : 'temp',
  title             : '',
  showFilter        : true,
  expanded          : false,
  reverseOrder      : false,
  showAuthor        : true,
  useCustomRenderer : true,
  contentClass      : ''
};
const cfg           = Object.assign(defaultOptions, options);
const cache         = useDataCache<DataCacheFilterObj>();
const { pages, pageTitle, activePage, goTo, isRunning, error: apiError, isGettingPageContent }
                    = useStaticPager<Article>(options.uri, cfg.version);
const titleRef      = computed(() => pageTitle.value || options.title);
const filteredPages = ref<Article[]>([]);

// When filter is disabled, we need to manually set pages
if (!cfg.showFilter) {
  !pages.value.length
    ? watch(() => isRunning.value, (isRunning) => !isRunning && onFilter(pages.value))
    : onFilter(pages.value)
  ;
}

// Prevent page from teleporting immediately to top after
// page content has been loaded. Instead we smooth scroll it.
watch(() => isGettingPageContent.value, (isGetting) => {
  if (isGetting) document.body.scrollTop = 0;
});

function onFilter(pages: Article[]) {
  filteredPages.value = pages;
}

onUnmounted(() => {
  // Reset filter on page navigation
  cache.updObjData('filter', 'isPersisting', false);
});

</script>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';
import { StaticPage, useStaticPager } from '@/composeables/staticPager';
import { DataCacheArrayKeys } from '@/state/cache-state';
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '../PageFooter.vue';
import RenderHtml from '../RenderMDHTML.vue';
import UxFilter from '@/components/ux/UxFilter.vue';
import UxPreloader from '@/components/ux/UxPreloader.vue';
import AppMarkdown from '../AppMarkdown.vue';
import AppLitCards from './AppLitCards.vue';
import PageError from '../PageError.vue';
import UxDisqus from '@/components/ux/UxDisqus.vue';

export interface Article extends StaticPage {
  summary: string;
}

export interface AppLitOptions {
  uri: DataCacheArrayKeys;
  title: string;
  isRed33m?: boolean;
  showFilter?: boolean;
  expanded?: boolean;
  reverseOrder?: boolean;
  showAuthor?: boolean;
  useCustomRenderer?: boolean;
  contentClass?: string;
  version?: string;
}

const props = defineProps({
  options: { type: Object as PropType<AppLitOptions>, required: true },
});

const defaultOptions: AppLitOptions = {
  uri: 'temp',
  title: '',
  isRed33m: false,
  showFilter: true,
  expanded: false,
  reverseOrder: false,
  showAuthor: true,
  useCustomRenderer: true,
  contentClass: '',
};
const cfg = Object.assign(defaultOptions, props.options);
const {
  pages,
  activePage,
  goTo,
  isRunning,
  error: apiError,
  hasURI,
  pageTitle,
} = useStaticPager<Article>(props.options.uri, cfg.version);
const titleRef = computed(() => pageTitle.value || props.options.title);
const filteredPages = ref<Article[]>([]);

// When filter is disabled, we need to manually set pages
if (!cfg.showFilter) {
  !pages.value.length
    ? watch(
        () => isRunning.value,
        (isRunning) => {
          !isRunning && onFilter(pages.value);
        }
      )
    : onFilter(pages.value);
}

function onFilter(pages: Article[]) {
  filteredPages.value = pages;
}
</script>

<template>
  <div class="lit">
    <page-titlebar
      :is-red33m="options.isRed33m"
      :ease-in="300"
      :ease-out="300"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isRunning" />
      <page-error v-else-if="apiError" class="error">
        {{ apiError.data }}<br />
        Try again later...
      </page-error>
      <div v-else-if="!activePage && !hasURI" class="lit-cards__container">
        <ux-filter
          v-if="cfg.showFilter"
          :id="cfg.uri"
          :items="pages"
          :reverse-order="cfg.reverseOrder"
          @filter="onFilter"
        />
        <app-lit-cards
          :cards="filteredPages"
          :go-to="goTo"
          :show-author="cfg.showAuthor"
          :show-full-date="cfg.expanded"
        />
        <page-footer />
      </div>
      <div v-else-if="activePage">
        <render-html v-if="cfg.useCustomRenderer" :html="activePage.data!" />
        <app-markdown
          v-else
          :simple="false"
          :class="cfg.contentClass"
          :html="activePage.data"
        />
        <ux-disqus />
        <page-footer />
      </div>
    </transition>
  </div>
</template>

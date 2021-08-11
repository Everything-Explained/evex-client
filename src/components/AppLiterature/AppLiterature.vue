<template>
  <div class="lit">
    <pg-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isRunning" />
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
        <pg-footer />
      </div>
      <div v-else-if="activePage">
        <render-html v-if="cfg.useCustomRenderer"
                     :html="activePage.content"
        />
        <app-md v-else
                :simple="false"
                :class="cfg.contentClass"
                v-html="activePage.content"
        />
        <pg-footer />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, onUnmounted, PropType, ref, watch } from "vue";
import { useDate } from '@/composeables/date';
import { isEthan } from "@/composeables/globals";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import { DataCacheArrayKeys, DataCacheFilterObj, useDateCache } from "@/state/cache-state";
import PageTitlebarVue  from "@/components/PageTitlebar.vue";
import PageFooterVue from "../PageFooter.vue";
import RenderHtmlVue from "../RenderHtml.vue";
import uxFilterVue   from "../UxFilter.vue";
import UxPreloaderVue from '../UxPreloader.vue';
import AppMarkdownVue from "../AppMarkdown.vue";
import AppLitCardsVue from "./AppLitCards.vue";


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
}


export default defineComponent({
  components: {
    'ux-preloader' : UxPreloaderVue,
    'pg-titlebar'  : PageTitlebarVue,
    'pg-footer'    : PageFooterVue,
    'ux-filter'    : uxFilterVue,
    'render-html'  : RenderHtmlVue,
    'app-md'       : AppMarkdownVue,
    'app-lit-cards' : AppLitCardsVue,
  },
  props: {
    options: { type: Object as PropType<AppLitOptions>, required: true },
  },
  setup({options}) {
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
    const cfg      = Object.assign(defaultOptions, options);
    const cache    = useDateCache<DataCacheFilterObj>();
    const pager    = useStaticPager<Article>(options.uri);
    const titleRef = computed(
      () => pager.pageTitle.value || options.title
    );

    const filteredPages = ref<Article[]>([]);

    // When filter is disabled, we need to manually set pages
    if (!cfg.showFilter) {
      watch(() => pager.isRunning.value,
        (isRunning) => !isRunning && onFilter(pager.pages.value)
      );
    }

    function onFilter(pages: Article[]) {
      filteredPages.value = pages;
    }

    onUnmounted(() => {
      // Reset filter on page navigation
      cache.updObjData('filter', 'isPersisting', false);
    });

    return {
      titleRef,
      ...pager,
      useDate,
      onFilter,
      filteredPages,
      isEthan,
      cfg,
    };
  }
});
</script>

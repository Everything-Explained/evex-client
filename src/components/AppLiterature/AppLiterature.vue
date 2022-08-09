

<script lang="ts" setup>
import { computed, PropType, ref, watch } from "vue";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import { DataCacheArrayKeys } from "@/state/cache-state";
import PageTitlebar from "@/components/PageTitlebar.vue";
import PageFooter   from "../PageFooter.vue";
import RenderHtml   from "../RenderHtml.vue";
import UxFilter     from "../UxFilter.vue";
import UxPreloader  from '../UxPreloader.vue';
import AppMarkdown  from "../AppMarkdown.vue";
import AppLitCards  from "./AppLitCards.vue";
import PageError    from '../PageError.vue';
import UxDisqus     from "../UxDisqus.vue";


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
const { pages, pageTitle, activePage, goTo, isRunning, error: apiError }
                    = useStaticPager<Article>(options.uri, cfg.version);
const titleRef      = computed(() => pageTitle.value || options.title);
const filteredPages = ref<Article[]>([]);
const activeContent  = ref(1);


// When filter is disabled, we need to manually set pages
if (!cfg.showFilter) {
  !pages.value.length
    ? watch(() => isRunning.value, (isRunning) => !isRunning && onFilter(pages.value))
    : onFilter(pages.value)
  ;
}


// A trick to toggle between two identical content elements
// such that the transition animation is triggered.
let contentCount = -1;
watch(() => activePage.value, () => {
  activeContent.value = contentCount++ % 2 == 0 ? 1 : 2;
});


function onFilter(pages: Article[]) {
  filteredPages.value = pages;
}


</script>





<template>
  <div class="lit">
    <page-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <ux-preloader v-if="isRunning" />
      <page-error v-else-if="apiError" class="error">
        {{ apiError.data }}<br>
        Try again later...
      </page-error>
      <div v-else-if="!activePage" class="lit-cards__container">
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
          :expanded="cfg.expanded"
        />
        <page-footer />
      </div>
      <!--
           THE FOLLOWING DUPLICATE CODE IS NECESSARY

           A trick is being utilized here to trigger the animation
           from the transition element, when a link navigates to a
           page within the same URL root.

           (i.e. blog entry link navigates to another blog entry)
      -->
      <div v-else-if="activeContent == 1 && activePage">
        <render-html v-if="cfg.useCustomRenderer" :html="activePage.content" />
        <app-markdown
          v-else
          :simple="false"
          :class="cfg.contentClass"
          v-html="activePage.content"
        />
        <ux-disqus />
        <page-footer />
      </div>
      <div v-else-if="activeContent == 2 && activePage">
        <render-html v-if="cfg.useCustomRenderer" :html="activePage.content" />
        <app-markdown
          v-else
          :simple="false"
          :class="cfg.contentClass"
          v-html="activePage.content"
        />
        <ux-disqus />
        <page-footer />
      </div>
    </transition>
  </div>
</template>







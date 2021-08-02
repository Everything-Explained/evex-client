<template>
  <div class="lit">
    <pg-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <div v-if="isRunning" class="preloader page" />
      <div v-else-if="!activePage" class="lit-cards__container">
        <ux-filter
          v-if="showFilter"
          :items="pages"
          :reverse-order="reverseOrder"
          @filter="onFilter"
        />
        <div :class="['lit__cards', sizeClass]">
          <div v-for="(article, i) of filteredPages"
               :key="i"
               :class="['lit__card', sizeClass]"
          >
            <header @click="goTo(article.uri)">
              {{ article.title }}
            </header>
            <article class="--subtle-scrollbar">
              {{ article.summary }}
            </article>
            <footer>
              <span v-if="showAuthor" class="lit-card__author">
                <ux-icon type="user" />
                <span :class="['lit-card__author-text', { '--is-ethan': isEthan(article.author) }]">
                  {{ article.author }}
                </span>
              </span>
              <span class="lit-card__timestamp">
                <span v-if="showDateTime" class="lit-card__full-datetime">
                  <span class="lit-card__date">
                    {{ useDate(article.date).toShortDate() }}
                  </span>
                  <span class="lit-card__time">
                    <ux-bullet />
                    {{ useDate(article.date).to12HourTime() }}
                  </span>
                </span>
                <span v-else class="lit-card__relative-time">
                  <ux-bullet />
                  {{ useDate(article.date).toRelativeTime() }}
                </span>
              </span>
            </footer>
          </div>
        </div>
        <pg-footer />
      </div>
      <div v-else-if="activePage">
        <render-html v-if="useCustomRenderer"
                     :html="activePage.content"
        />
        <article v-else
                 :class="['md', contentClass]"
                 v-html="activePage.content"
        />
        <pg-footer />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import './styles/app-literature.css';
import './styles/app-literature.mobile.css';
import { computed, defineComponent, onUnmounted, PropType, ref } from "vue";
import { useDate } from '@/composeables/date';
import { isEthan } from "@/composeables/globals";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import { DataCacheArrayKeys, DataCacheFilterObj, useDateCache } from "@/state/cache-state";
import PageTitlebarVue  from "@/components/PageTitlebar.vue";
import PageFooterVue from "./PageFooter.vue";
import RenderHtmlVue from "./RenderHtml.vue";
import uxIconVue     from "@/components/UxIcon.vue";
import uxBulletVue   from "./UxBullet.vue";
import uxFilterVue   from "./UxFilter.vue";



export interface Article extends StaticPage {
  summary: string;
}

const _sizes = ['compact', 'expanded'];


export default defineComponent({
  components: {
    'pg-titlebar': PageTitlebarVue,
    'ux-icon': uxIconVue,
    'ux-bullet': uxBulletVue,
    'pg-footer': PageFooterVue,
    'ux-filter': uxFilterVue,
    'render-html'  : RenderHtmlVue,
  },
  props: {
    size              : { type: String,  default: 'compact'       },
    uri               : { type: String as PropType<DataCacheArrayKeys>,  default: ''              },
    title             : { type: String,  default: 'Default Title' },
    contentClass      : { type: String,  default: ''              },
    showAuthor        : { type: Boolean, default: true            },
    showDateTime      : { type: Boolean, default: false           },
    showFilter        : { type: Boolean, default: true            },
    reverseOrder      : { type: Boolean, default: false           },
    useCustomRenderer : { type: Boolean, default: true            },
  },
  setup(props) {
    const { size, uri } = props;
    const sizeClass = { '--expanded': size == 'expanded' };
    const cache = useDateCache<DataCacheFilterObj>();

    if (!uri) throw Error('literature::Missing URL');
    if (!_sizes.includes(size)) throw Error('literature::Invalid Size')
    ;
    const pager    = useStaticPager<Article>(uri);
    const titleRef = computed(
      () => pager.pageTitle.value || props.title
    );
    const filteredPages =
      props.showFilter
        ? ref<Article[]>([])
        : pager.pages
    ;

    function onFilter(pages: Article[]) { filteredPages.value = pages; }

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
      sizeClass,
    };
  }
});
</script>
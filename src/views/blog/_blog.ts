import { defineComponent, Ref, ref, watch } from "vue";
import blogPosts from './blog.json';
import icon from '../../components/icon.vue';
import { dateToShortMDY, dateTo12HourTimeStr } from "../../composeables/date-utils";
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { VuexStore } from "../../vuex/vuex-store";
import titlebar from '../../components/titlebar.vue';


type BlogPost = typeof blogPosts[0];
type BlogPostRef = Ref<BlogPost|null>;
type Route = RouteLocationNormalizedLoaded;

const extractP = /<p>.*<\/p>/;


export default defineComponent({
  components: {
    icon,
    'title-bar': titlebar,
  },

  setup() {
    const activePost = ref<BlogPost|null>(null);
    const router     = useRouter();
    const route      = useRoute();
    const postURI    = route.params.post as string|undefined;
    const store      = useStore<VuexStore>();
    const title      = ref('')
    ;
    const sortedPosts = sortPosts(blogPosts);
    const shortPosts  = shortenPostsContent(sortedPosts)
    ;
    title.value = 'Blog Entries';
    onBlogRouteChange(route, router, sortedPosts, activePost, title);
    if (postURI) displayBlogPost(postURI, sortedPosts, router, activePost, title);
    store.commit('page-title', title.value)
    ;
    function goTo(uri: string) {
      router.push(`/blog/${uri}`);
    }
    return {
      posts: shortPosts,
      activePost,
      goTo,
      onBeforeTransLeave: () => store.commit('page-title', title.value)
    };
  },


  methods: {
    formatDate(isoDateStr: string) {
      return dateToShortMDY(isoDateStr);
    },
    formatTime(isoDateStr: string) {
      return dateTo12HourTimeStr(isoDateStr);
    }
  }
});



function sortPosts(posts: BlogPost[]) {
  return posts.sort((d1, d2) => (
    new Date(d2.date).getTime() - new Date(d1.date).getTime()
  ));
}

function shortenPostsContent(posts: BlogPost[]) {
  return posts.map(post => {
    const snippet = extractP.exec(post.content);
    if (!snippet) throw Error('blog::snippet regex failed');
    return {
      ...post,
      content: snippet[0]
    };
  });
}

function onBlogRouteChange(
    route      : Route,
    router     : Router,
    posts      : BlogPost[],
    contentRef : BlogPostRef,
    titleRef      : Ref<string>,
) {
  watch(
    () => route.params,
    async (params) => {
      if (!route.path.includes('/blog')) return;
      if (!params.post) {
        contentRef.value = null;
        titleRef.value = 'Blog Entires';
        return;
      }
      displayBlogPost(params.post as string, posts, router, contentRef, titleRef);
    }
  );
}

function displayBlogPost(
  uri        : string,
  posts      : BlogPost[],
  router     : Router,
  contentRef : BlogPostRef,
  titleRef   : Ref<string>,
) {
  const post = posts.find(post => post.uri == uri);
  if (!post) { router.push('/404'); return; }
  titleRef.value = post.title;
  contentRef.value = post;
}
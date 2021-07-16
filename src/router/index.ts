import { createRouter,
         createWebHistory,
         NavigationGuardNext,
         RouteLocationNormalized,
         RouteRecordRaw } from 'vue-router';
import { isAuthed }       from '@/globals';
import Home               from '@/views/Home.vue';
import i404               from '@/views/404Error.vue';
import R3dVideos          from '@/views/Red33mVideos.vue';
import Blog               from '@/views/Blog.vue';
import Videos             from '@/views/LibraryVideos.vue';
import Literature         from '@/views/LibraryLiterature.vue';
import red33mAuth         from '@/views/Red33mAuthPrompt.vue';
import red33mForm         from '@/views/Red33mAccessForm.vue';
import r3d_litVue         from '@/views/Red33mLiterature.vue';
import changelogVue       from '@/views/Changelog.vue';


const routes: Array<RouteRecordRaw> = [
  { path: '/home', alias: '/',          name: 'home',        component: Home,         },
  { path: '/blog/:page?',               name: 'blog',        component: Blog,         },
  { path: '/support',                   name: 'support',     component: () => import('@/views/Support.vue'),   },
  { path: '/red33m/videos',             name: 'r3d-videos',  component: R3dVideos,  beforeEnter: isAuthedGuard },
  { path: '/red33m/literature/:page?',  name: 'r3d-lit',     component: r3d_litVue, beforeEnter: isAuthedGuard },
  { path: '/red33m/auth',               name: 'red33m-auth', component: red33mAuth,   },
  { path: '/red33m/form',               name: 'red33m-form', component: red33mForm,   },
  { path: '/library/videos/:uri?',      name: 'lib-videos',  component: Videos,       },
  { path: '/library/literature/:page?', name: 'lib-lit',     component: Literature,   },
  { path: '/changelog/:page?',          name: 'changelog',   component: changelogVue, },
  { path: '/:pathMatch(.*)*',           name: '404',         component: i404,       meta: { display: false } }
];

function isAuthedGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!isAuthed()) return next('/red33m/auth');
  next();
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
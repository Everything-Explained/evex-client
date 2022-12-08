import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { isAuthed, isAuthedGuard, isDevelopment } from '@/globals';
import Home from '@/views/HomePage.vue';
import httpError404 from '@/views/errors/NotFoundError.vue';
import R3dVideos from '@/views/red33m/Red33mVideos.vue';
import PublicBlog from '@/views/public/PublicBlog.vue';
import Red33mBlog from '@/views/red33m/Red33mBlog.vue';
// import Videos from '@/views/LibraryVideos.vue';
import Literature from '@/views/public/PublicLiterature.vue';
import Red33mLogin from '@/views/red33m/Red33mLogin.vue';
import changelogVue from '@/views/ChangelogPage.vue';
import TempLibVid from '@/views/TempLibVid.vue';
import Red33mAccessForm from '@/views/red33m/Red33mAccessForm.vue';
import Red33mLiterature from '@/views/red33m/Red33mLiterature.vue';

export type StrictRouteName =
  | 'home'
  | 'home-redirect'
  | 'blog'
  | 'lib-videos'
  | 'lib-lit'
  | 'support'
  | 'changelog'
  | 'r3d-login'
  | 'r3d-lit'
  | 'r3d-blog'
  | 'r3d-videos'
  | 'r3d-form'
  | '403'
  | '404';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { cat: 'root', title: 'Home', visible: true, name: 'home' },
  },
  {
    path: '/home',
    name: 'home-redirect',
    redirect: '/',
    meta: { cat: 'root', title: 'Home', visible: false, name: 'home-redirect' },
  },
  // { path        : '/test',
  //   name        : 'test',
  //   component   : AppVideos,
  //   meta        : { cat: 'root', title: 'Test', visible: true }
  // },
  {
    path: '/blog/public/:page?',
    name: 'blog',
    component: PublicBlog,
    meta: { cat: 'root', title: 'Blog', visible: true, name: 'blog' },
  },
  {
    // path: '/videos/public/:category?/:id?',
    path: '/videos/public',
    name: 'lib-videos',
    component: TempLibVid,
    meta: { cat: 'root', title: 'Videos', visible: true, name: 'lib-videos' },
  },
  {
    path: '/literature/public/:page?',
    name: 'lib-lit',
    component: Literature,
    meta: { cat: 'root', title: 'Literature', visible: true, name: 'lib-lit' },
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('@/views/SupportPage.vue'),
    meta: { cat: 'root', title: 'Support', visible: true, name: 'support' },
  },
  {
    path: '/changelog/:page?',
    name: 'changelog',
    component: changelogVue,
    meta: { cat: 'root', title: 'ChangeLog', visible: true, name: 'changelog' },
  },
  {
    path: '/red33m/login',
    name: 'r3d-login',
    component: Red33mLogin,
    meta: {
      cat: 'RED33M',
      title: 'Login',
      visible: !isAuthed() || isDevelopment,
      name: 'r3d-login',
    },
  },
  {
    path: '/blog/red33m/:page?',
    name: 'r3d-blog',
    component: Red33mBlog,
    beforeEnter: isAuthedGuard,
    meta: {
      cat: 'RED33M',
      catVisible: isAuthed(),
      title: 'Blog',
      visible: isAuthed(),
      name: 'r3d-blog',
    },
  },
  {
    path: '/videos/red33m/:id?',
    name: 'r3d-videos',
    component: R3dVideos,
    beforeEnter: isAuthedGuard,
    meta: {
      cat: 'RED33M',
      title: 'Videos',
      visible: isAuthed(),
      name: 'r3d-videos',
    },
  },
  {
    path: '/literature/red33m/:page?',
    name: 'r3d-lit',
    component: Red33mLiterature,
    beforeEnter: isAuthedGuard,
    meta: {
      cat: 'RED33M',
      title: 'Literature',
      visible: isAuthed(),
      name: 'r3d-lit',
    },
  },
  {
    path: '/red33m/form',
    name: 'r3d-form',
    component: Red33mAccessForm,
    meta: {
      cat: 'Accessory',
      catVisible: isDevelopment,
      title: 'R3D Form',
      visible: true,
      name: 'r3d-form',
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/errors/ForbiddenError.vue'),
    meta: {
      cat: 'Accessory',
      title: '401',
      visible: isDevelopment,
      name: '403',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: httpError404,
    meta: {
      cat: 'Accessory',
      title: '404',
      visible: isDevelopment,
      name: '404',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Hack for globally manipulating router; dynamically injected
// HTML links use this to navigate to internal pages.
window.$router = router;

export default router;

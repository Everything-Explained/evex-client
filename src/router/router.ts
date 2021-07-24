import { createRouter,
         createWebHistory,
         RouteRecordName,
         RouteRecordRaw } from 'vue-router';
import { isAuthed, isAuthedGuard, isDevelopment }  from '@/globals';
import Home               from '@/views/Home.vue';
import i404               from '@/views/404Error.vue';
import R3dVideos          from '@/views/Red33mVideos.vue';
import Blog               from '@/views/Blog.vue';
import Videos             from '@/views/LibraryVideos.vue';
import Literature         from '@/views/LibraryLiterature.vue';
import Red33mLogin        from '@/views/Red33mLogin.vue';
import red33mForm         from '@/views/Red33mAccessForm.vue';
import r3d_litVue         from '@/views/Red33mLiterature.vue';
import changelogVue       from '@/views/Changelog.vue';
import { reactive  }      from '@vue/reactivity';


type Route = {
  name: RouteRecordName;
  title: string;
  visible: boolean;
}

type RouteCategory = {
  name: string;
  visible: boolean;
  routes: Route[]
};




const routes: Array<RouteRecordRaw> = [
  { path        : '/home',
    alias       : '/',
    name        : 'home',
    component   : Home,
    meta        : { cat: 'root', title: 'Home', visible: true }
  },
  { path        : '/blog/:page?',
    name        : 'blog',
    component   : Blog,
    meta        : { cat: 'root', title: 'Blog', visible: true }
  },
  { path        : '/library/videos/:uri?',
    name        : 'lib-videos',
    component   : Videos,
    meta        : { cat: 'root', title: 'Videos', visible: true }
  },
  { path        : '/library/literature/:page?',
    name        : 'lib-lit',
    component   : Literature,
    meta        : { cat: 'root', title: 'Literature', visible: true }
  },
  { path        : '/support',
    name        : 'support',
    component   : () => import('@/views/Support.vue'),
    meta        : { cat: 'root', title: 'Support', visible: true }
  },
  { path        : '/changelog/:page?',
    name        : 'changelog',
    component   : changelogVue,
    meta        : { cat: 'root', title: 'ChangeLog', visible: true }
  },
  { path        : '/red33m/login',
    name        : 'red33m-login',
    component   : Red33mLogin,
    meta        : { cat: 'RED33M', title: 'Login', visible: !isAuthed() }
  },
  { path        : '/red33m/videos',
    name        : 'r3d-videos',
    component   : R3dVideos,
    beforeEnter : isAuthedGuard,
    meta        : { cat: 'RED33M', catVisible: isAuthed(), title: 'Videos', visible: isAuthed() }
  },
  { path        : '/red33m/literature/:page?',
    name        : 'r3d-lit',
    component   : r3d_litVue,
    beforeEnter : isAuthedGuard,
    meta        : { cat: 'RED33M', title: 'Literature', visible: isAuthed() }
  },
  { path        : '/red33m/form',
    name        : 'red33m-form',
    component   : red33mForm,
    meta        : { cat: 'Accessory', catVisible: isDevelopment, title: 'R3D Form', visible: true }
  },
  { path        : '/:pathMatch(.*)*',
    name        : '404',
    component   : i404,
    meta        : { cat: 'Accessory', title: '404', visible: isDevelopment }
  }
];

export const tempRouteMap: RouteCategory[] = [];

routes.forEach((route, i) => {
  if (!route.meta) return;
  const r: Route = reactive({
    name    : route.name!, // All routes have names
    title   : route.meta.title,
    visible : route.meta.visible,
  });
  const routeCat: RouteCategory = {
    name    : route.meta.cat,
    visible : route.meta.catVisible ?? true,
    routes  : [r]
  };
  if (i == 0 || tempRouteMap[tempRouteMap.length - 1].name != route.meta.cat)
    return tempRouteMap.push(reactive(routeCat))
  ;
  console.log(routeCat);
  tempRouteMap[tempRouteMap.length - 1].routes.push(r);
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;




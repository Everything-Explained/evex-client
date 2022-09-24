import { routes } from '@/router/router';
import { reactive } from 'vue';
import { RouteRecordName } from 'vue-router';

type Route = {
  name: RouteRecordName;
  title: string;
  visible: boolean;
};

type RouteCategory = {
  name: string;
  visible: boolean;
  isRed33m: boolean;
  routes: Route[];
};

export function useRouteMap() {
  const routeMap: RouteCategory[] = [];
  routes.forEach((route, i) => {
    if (!route.meta) return;
    const r: Route = reactive({
      name: route.name!, // All routes have names
      title: route.meta.title,
      visible: route.meta.visible,
    });
    if (i == 0 || routeMap[routeMap.length - 1].name != route.meta.cat) {
      return routeMap.push(
        reactive({
          name: route.meta.cat,
          visible: route.meta.catVisible ?? true,
          isRed33m: route.meta.cat.includes('RED33M'),
          routes: [r],
        })
      );
    }
    routeMap[routeMap.length - 1].routes.push(r);
  });
  return routeMap;
}

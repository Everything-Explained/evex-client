import { routes } from "@/router/router";
import { reactive } from "vue";
import { RouteRecordName } from "vue-router";

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

export function useRouteMap() {
  const routeMap: RouteCategory[] = [];
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
    if (i == 0 || routeMap[routeMap.length - 1].name != route.meta.cat)
      return routeMap.push(reactive(routeCat))
    ;
    routeMap[routeMap.length - 1].routes.push(r);
  });
  return routeMap;
}

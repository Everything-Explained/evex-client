import { RouteLocationNormalizedLoaded, Router } from "vue-router";

export type ISODateString = string;

export type Route = RouteLocationNormalizedLoaded;

declare global {
  interface Window {
    app: any;
    $router: Router;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    cat: string;
    catVisible?: boolean;
    title: string;
    visible: boolean;
  }
}


export interface Video {
  id      : string;
  title   : string;
  author  : string;
  content : string;
  date    : ISODateString;
}
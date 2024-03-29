import { StrictRouteName } from '@/router/router';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';

export type ISODateString = string;

export type Route = RouteLocationNormalizedLoaded;

type DisqusConfigOptions = {
  reload: boolean;
  page?: {
    identifier: string;
  };
  config?: () => void;
};

declare global {
  interface Window {
    app: any;
    $router: Router;
    DISQUSWIDGETS: {
      getCount: (options: { reset: boolean }) => void;
    };
    DISQUS: {
      reset: (options: DisqusConfigOptions) => void;
    };
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

declare module 'vue' {
  interface HTMLAttributes {
    dataNum?: string;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    cat: string;
    catVisible?: boolean;
    title: string;
    visible: boolean;
    name: StrictRouteName;
  }
}

export interface Video {
  id: string;
  title: string;
  author: string;
  summary: string;
  date: ISODateString;
}

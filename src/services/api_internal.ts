import { reactive, computed } from 'vue';
import { isProduction } from '../globals';
import wretch, { WretchResponse } from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import { ISODateString } from '@/typings/global-types';
import { useEventBus } from '@/state/event-bus';

export interface APIResponse<T> {
  status: number;
  data: T;
}

export interface APIErrorResp {
  response: any; // This is a large response object
  status: number;
  text: string;
  message: string;
}

interface APIOptions {
  URI: string;
  method: 'get' | 'put' | 'post';
  body: RequestBody;
  type?: APIReqType;
  version?: string | undefined;
  dataType?: 'json' | 'text';
}

type APIReqType = 'dynamic' | 'static';
type RequestBody = { [key: string]: string | number | boolean | Array<any> };
type APIVersionNames =
  | 'build'
  | 'pubBlog'
  | 'r3dBlog'
  | 'chglog'
  | 'home'
  | 'pubLit'
  | 'libVid'
  | 'r3dLit'
  | 'r3dVid';
export type APIVersions = Record<
  APIVersionNames,
  { v: string; n: ISODateString }
>;

const genUniqueID = () =>
  crypto
    .getRandomValues(new Uint8Array(20))
    .reduce((pv, cv) => (pv += cv.toString(36)), '');

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `//localhost:3001${url}`;
};

const state = reactive({
  userid: '',
  isInitializing: false,
  versions: undefined as APIVersions | undefined,
  isLoading: false,
  endPoint: wretch().addon(QueryStringAddon).url(sanitizeURLForEnv('/api')),
  isDebouncing: false,
});

async function init() {
  state.isInitializing = true;
  state.userid = localStorage.getItem('userid') || genUniqueID();
  const versions = localStorage.getItem('versions');
  state.versions =
    versions && versions.includes('{')
      ? (JSON.parse(versions) as APIVersions)
      : undefined;
  state.endPoint = state.endPoint.auth(`Bearer ${state.userid || 'none'}`);
  localStorage.setItem('userid', state.userid);

  const res = await API.get<APIVersions>('/auth/setup', {}).catch(
    (err: APIResponse<string>) => {
      return err;
    }
  );

  if (typeof res.data != 'string') {
    // User created with default passcode
    if (res.status == 201) localStorage.setItem('passcode', 'no');
    if (state.versions?.build != res.data.build) {
      localStorage.setItem('versions', JSON.stringify(res.data));
      state.versions = res.data;
    }
  }
  state.isInitializing = false;
}

function callAPI<T>(opts: APIOptions): Promise<APIResponse<T>> {
  return new Promise((rs, rj) => {
    if (opts.URI != '/auth/setup') {
      if (debounceOnPending(rs, () => callAPI(opts))) return;
    }
    state.isLoading = true;
    const api = setupAPI(opts);
    api
      .fetchError(sendServerIsOffline) // Catches Network Errors
      .error(521, sendServerIsOffline) // Cloudflare tells us server is down
      .forbidden(() => {
        const eventBus = useEventBus();
        localStorage.setItem('passcode', 'no');
        eventBus.updateMenu('red-videos', false);
        eventBus.updateMenu('red-lit', false);
        eventBus.updateMenu('red-login', true);
        window.$router.push('/403');
      })
      .res(resolve)
      .catch(reject)
      .finally(() => (state.isLoading = false));

    function sendServerIsOffline() {
      rj({ status: 521, data: 'Server is Offline' } as APIResponse<string>);
    }

    async function resolve(res: WretchResponse) {
      rs({
        status: res.status,
        data:
          opts.method == 'get'
            ? opts.dataType == 'text'
              ? await res.text()
              : await res.json()
            : await res.text(),
      });
    }

    function reject(err: APIErrorResp) {
      rj({
        status: err.status,
        data: err.message.includes('{') ? JSON.parse(err.message) : err.message,
      });
    }
  });
}

function setupAPI(opts: APIOptions) {
  const { URI, method, body, type, version } = opts;
  if ((type || 'dynamic') == 'static')
    body.v = Math.floor(Math.random() * 10000).toString() || version || state.versions?.build.v || '';
  const api =
    method == 'get'
      ? state.endPoint.url(URI).query(body)[method]()
      : state.endPoint.url(URI)[method](body);
  return api;
}

function debounceOnPending(rs: (val: any) => void, cb: () => Promise<any>) {
  if (state.isInitializing) {
    debounce(100, () => rs(cb()));
    return true;
  }
  return false;
}

function debounce(delay: number, func: () => void) {
  state.isDebouncing = true;
  setTimeout(() => {
    state.isDebouncing = false;
    func();
  }, delay);
}

const API = {
  get<T>(
    endpoint: string,
    query: RequestBody | null,
    version = '',
    type: APIReqType = 'dynamic',
    dataType = 'json' as 'json' | 'text' | undefined
  ) {
    return callAPI<T>({
      URI: endpoint,
      method: 'get',
      body: query || {},
      type,
      version,
      dataType,
    });
  },
  post<T>(endpoint: string, body: RequestBody) {
    return callAPI<T>({ URI: endpoint, method: 'post', body });
  },
  put<T>(endpoint: string, body: RequestBody) {
    return callAPI<T>({ URI: endpoint, method: 'put', body });
  },
};

export function useAPI() {
  return {
    init,
    debounce,
    ...API,
    isPending: computed(
      () => state.isDebouncing || state.isLoading || state.isInitializing
    ),
    state,
  };
}

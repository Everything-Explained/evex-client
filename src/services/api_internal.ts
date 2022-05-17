import { reactive, computed } from "vue";
import { isProduction } from "../globals";
import wretch from 'wretch';


export interface APIResponse<T> {
  status : number;
  data   : T
}

export interface APIErrorResp {
  response : any; // This is a large response object
  status   : number;
  text     : string;
  message  : string;
}

interface APIOptions {
  URI       : string;
  method    : 'get'|'put'|'post';
  body      : RequestBody;
  type     ?: APIReqType;
  version  ?: string | undefined;
  dataType ?: 'json'|'text';
}

type APIReqType    = 'dynamic'|'static';
type RequestBody   = { [key: string]: string|number|boolean|Array<any> }
export type APIVersions = {
  build  : string;
  blog   : string;
  libLit : string;
  r3dLit : string;
  chglog : string;
  libVid : string;
  r3dVid : string;
}

const genUniqueID = () =>
  crypto
    .getRandomValues(new Uint8Array(20))
    .reduce((pv, cv) => pv += cv.toString(36), '')
;

const versions = localStorage.getItem('versions');

const state = reactive({
  userid        : localStorage.getItem('userid') || genUniqueID(),
  isInitialized : false,
  initializing  : false,
  versions      : versions ? JSON.parse(versions) as APIVersions : undefined,
  isLoading     : false,
  isDebouncing  : false,
});

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `//127.0.0.1:3003${url}`;
};

const apiEndpoint =
  wretch()
    .url(sanitizeURLForEnv('/api'))
    .auth(`Bearer ${state.userid || 'none'}`)
;



async function init() {
  state.initializing = true;
  // Is always a valid userid
  localStorage.setItem('userid', state.userid)
  ;
  const res =
    await API
      .get<APIVersions>('/auth/setup', { userid: state.userid })
      .catch((err: APIResponse<string>) => {
        return err;
      })
  ;

  if (typeof res.data != 'string') {
    // User created with default passcode
    if (res.status == 201) localStorage.setItem('passcode', 'no');
    if (state.versions?.build != res.data.build) {
      localStorage.setItem('versions', JSON.stringify(res.data));
      state.versions = res.data;
    }
  }
  state.isInitialized = true;
}


function callAPI<T>(opts: APIOptions): Promise<APIResponse<T>> {
  checkInitialization();
  return new Promise((rs, rj) => {
    if (debounceOnPending(rs, () => callAPI(opts))) return;
    state.isLoading = true;
    const api = setupAPI(opts);
    const sendServerIsOffline = () =>
      rj({ status: 521, data: 'Server is Offline' } as APIResponse<string>)
    ;
    api
      .fetchError(sendServerIsOffline) // Catches Network Errors
      .error(521, sendServerIsOffline) // Cloudflare tells us server is down
      .res(async (res) => rs({
        status: res.status,
        data: opts.method == 'get'
                ? opts.dataType == 'text' ? await res.text() : await res.json()
                : await res.text()
      }))
      .catch((err: APIErrorResp) => {
        rj({
          status : err.status,
          data   : err.message } as APIResponse<string>
        );
      })
      .finally(() => state.isLoading = false)
    ;
  });
}


function setupAPI(opts: APIOptions) {
  const { URI, method, body, type, version } = opts
  ;
  if ((type || 'dynamic') == 'static')
    body.version = version || state.versions?.build || ''
  ;
  const api = (method == 'get')
    ? apiEndpoint.url(URI).query(body)[method]()
    : apiEndpoint.url(URI)[method](body)
  ;
  return api;
}


function checkInitialization() {
  if (!state.isInitialized && !state.initializing) {
    const err = Error('useAPI() is NOT initialized');
    console.error(err);
    throw err;
  }
}


function debounceOnPending(rs: (val: any) => void, cb: () => Promise<any>) {
  const isPending = state.isLoading || state.isDebouncing;
  if (isPending) { debounce(100, () => rs(cb())); return true; }
  return false;
}


function debounce(delay: number, func: () => void) {
  state.isDebouncing = true;
  setTimeout(() => { state.isDebouncing = false; func(); }, delay);
}


const API = {
  get<T>(endpoint: string, query: RequestBody|null, version = '', type: APIReqType = 'dynamic', dataType = 'json' as 'json'|'text'|undefined) {
    return callAPI<T>({ URI: endpoint, method: 'get', body: query || {}, type, version, dataType });
  },
  post<T>(endpoint: string, body: RequestBody) {
    return callAPI<T>({ URI: endpoint, method: 'post', body });
  },
  put<T>(endpoint: string, body: RequestBody) {
    return callAPI<T>({ URI: endpoint, method: 'put', body });
  }
};



export function useAPI() {
  return {
    init,
    debounce,
    ...API,
    isPending: computed(() => state.isDebouncing || state.isLoading),
    state
  };
}
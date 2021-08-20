import { reactive, computed } from "vue";
import { isProduction } from "../globals";
import wretch from 'wretch';
import { useVersionManager } from "./versionManager";


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
  URI      : string;
  method   : 'get'|'put'|'post';
  body     : RequestBody;
  type    ?: APIReqType;
}

type APIReqType    = 'dynamic'|'static';
type RequestBody   = { [key: string]: string|number|boolean|Array<any> }


const genUniqueID = () =>
  crypto
    .getRandomValues(new Uint8Array(20))
    .reduce((pv, cv) => pv += cv.toString(36), '')
;

const state = reactive({
  userid        : localStorage.getItem('userid') || genUniqueID(),
  isInitialized : false,
  initializing  : false,
  version       : localStorage.getItem('version') || undefined,
  isLoading     : false,
  isDebouncing  : false,
});

const sanitizeURLForEnv = (url: string) => {
  return isProduction ? url : `//localhost:3003${url}`;
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
      .get<{version: string}>('/auth/setup', { userid: state.userid })
      .catch((err: APIResponse<string>) => {
        return err;
      })
  ;
  const verMan = useVersionManager(state.version);
  if (typeof res.data != 'string') {
    // User id created
    if (res.status == 201) localStorage.setItem('passcode', 'no');
    if (!state.version || state.version != res.data.version) {
      localStorage.setItem('version', res.data.version);
      state.version = res.data.version;
      verMan.addVersion(state.version);
    }
  }

  if (res.status == 521) {
    console.log(verMan);
    console.warn('Skipping User Authentication');
    if (!verMan.version)
      console.warn('No Versions available to fallback on')
    ;
    else console.warn(`Falling back on version: ${verMan.version}`);
  }
  state.isInitialized = true;
}


function callAPI<T>(opts: APIOptions): Promise<APIResponse<T>> {
  checkInitialization();
  return new Promise((rs, rj) => {
    if (debounceOnPending(rs, () => callAPI(opts))) return;
    state.isLoading = true;
    const api = setupAPI(opts);
    const serverIsDown = () => rj({ status: 521, data: 'Server is Down' } as APIResponse<string>);
    api
      // Catches Netork Errors
      .fetchError(serverIsDown)
      // Cloudlfare tells us server is down
      .error(521, serverIsDown)
      .res(async (res) => rs({
        status: res.status,
        data: opts.method == 'get' ? await res.json() : await res.text()
      }))
      .catch(err =>
        rj({ status: 0, data: err.toString() } as APIResponse<string>)
      )
      .finally(() => state.isLoading = false)
    ;
  });
}


function setupAPI(opts: APIOptions) {
  const { URI, method, body, type } = opts
  ;
  if ((type || 'dynamic') == 'static')
    body.version = state.version || ''
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
  get<T>(endpoint: string, query: RequestBody|null, type: APIReqType = 'dynamic') {
    return callAPI<T>({ URI: endpoint, method: 'get', body: query || {}, type });
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
    isPending: computed(() => state.isDebouncing || state.isLoading)
  };
}
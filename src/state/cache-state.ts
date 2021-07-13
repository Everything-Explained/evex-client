import { computed, reactive } from "vue";

const state = reactive({
  'filter': {
    pages          : [],
    isOpen         : false,
    reversed       : false,
    authorIndexMap : [],
    isPersisting   : false,
  },
  'titlebar-menu-open'        : false,
  'lazyimg-data'              : [],
  'blog'                      : [],
  'changelog'                 : [],
  'library/literature'        : [],
  'red33m/literature'         : [],
  '/data/red33m/videos.json'  : [],
  '/data/library/videos.json' : [],
} as { [key: string]: any });

export interface DataCacheFilterObj {
  pages          : any[];
  isOpen         : boolean;
  reversed       : boolean;
  authorIndexMap : any[];
  isPersisting   : boolean;
}

export type DataCacheObjKeys   = 'filter';
export type DataCacheArrayKeys = 'lazyimg-data'|string;
export type DataCacheKeys      = 'titlebar-menu-open'|string;

// NOTE: We are assuming that all contained non-primitive types will
//       NOT be mutated. E.g. [Object, Object] or { foo: ['bar'] }
export function useDateCache() {
  return {
    setArrayData: (key: DataCacheArrayKeys, val: any[]) => {
      catchMissingState(key);
      state[key] = val.slice();
    },
    updArrayData: (key: DataCacheArrayKeys, val: string|boolean|number) => {
      catchMissingState(key);
      (state[key] as any[]).push(val);
    },
    getArrayData: <T>(key: DataCacheArrayKeys) => {
      catchMissingState(key);
      return computed(() => (state[key]?.slice() || []) as T[]);
    },

    setObjData: (key: string, val: any) => {
      catchMissingState(key);
      state[key] = { ...val };
    },
    updObjData: <T>(key: DataCacheObjKeys, prop: keyof T, val: any) => {
      catchMissingState(key);
      const data = state[key][prop];
      const hasSameType =
        (typeof data == typeof val) && (data instanceof Array == val instanceof Array)
      ;
      if (undefined == data) throw Error(`Property "${prop}" does not exist on Object`);
      if (!hasSameType)      throw Error('Value must be of the same type as the Object Property');
      state[key][prop] = val;
    },
    getObjData: <T>(key: DataCacheObjKeys) => {
      catchMissingState(key);
      return computed(() => ({ ...state[key] } as T));
    },

    setData: (key: DataCacheKeys, val: string|boolean|number) => {
      catchMissingState(key);
      state[key] = val;
    },
    getData: <T>(key: DataCacheKeys) => {
      catchMissingState(key);
      return computed(() => state[key] as T);
    }
  };
}

function catchMissingState(key: string) {
  if (undefined == state[key]) throw Error(`Missing Cache Entry::${key}`);
}



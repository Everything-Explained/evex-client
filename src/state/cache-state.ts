import { computed, reactive } from "vue";

const stateOfArrays = reactive({
  'lazyimg-data'              : [],
  'blog'                      : [],
  'changelog'                 : [],
  'library/literature'        : [],
  'red33m/literature'         : [],
  '/data/red33m/videos.json'  : [],
  '/data/library/videos.json' : [],
});

const stateOfObjects = reactive({
  filter: {
    pages          : [],
    isOpen         : false,
    reversed       : false,
    authorIndexMap : [],
    isPersisting   : false,
  },
});

const stateOfPrimitives = reactive({
  'titlebar-menu-open'        : false,
});

export interface DataCacheFilterObj {
  pages          : any[];
  isOpen         : boolean;
  reversed       : boolean;
  authorIndexMap : any[];
  isPersisting   : boolean;
}

export type DataCacheObjKeys   = keyof typeof stateOfObjects;
export type DataCacheArrayKeys = keyof typeof stateOfArrays;
export type DataCacheKeys      = keyof typeof stateOfPrimitives;

// NOTE: We are assuming that all contained non-primitive types will
//       NOT be mutated. E.g. [Object, Object] or { foo: ['bar'] }
export function useDateCache<T>() {
  return {
    setArrayData: (key: DataCacheArrayKeys, val: any[]) => {
      catchMissingState(key as string, stateOfArrays);
      (stateOfArrays[key] as any[]) = val.slice();
    },
    updArrayData: (key: DataCacheArrayKeys, val: any) => {
      catchMissingState(key as string, stateOfArrays);
      (stateOfArrays[key] as any[]).push(val);
    },
    getArrayData: (key: DataCacheArrayKeys) => {
      catchMissingState(key as string, stateOfArrays);
      return computed(() => (stateOfArrays[key]?.slice() || []) as T[]);
    },

    setObjData: (key: DataCacheObjKeys, val: any) => {
      catchMissingState(key as string, stateOfObjects);
      stateOfObjects[key] = { ...val };
    },
    updObjData: (key: DataCacheObjKeys, prop: keyof T, val: any) => {
      catchMissingState(key as string, stateOfObjects);
      const data = (stateOfObjects[key] as any)[prop];
      const hasSameType =
        (typeof data == typeof val) && (data instanceof Array == val instanceof Array)
      ;
      if (undefined == data) throw Error(`Property "${prop}" does not exist on Object`);
      if (!hasSameType)      throw Error('Value must be of the same type as the Object Property');
      (stateOfObjects[key] as any)[prop] = val;
    },
    getObjData: (key: DataCacheObjKeys) => {
      catchMissingState(key as string, stateOfObjects);
      return computed(() => ({ ...(stateOfObjects[key] as any) } as T));
    },

    setData: (key: DataCacheKeys, val: string|boolean|number) => {
      catchMissingState(key as string, stateOfPrimitives);
      (stateOfPrimitives[key] as any) = val;
    },
    getData: (key: DataCacheKeys) => {
      catchMissingState(key as string, stateOfPrimitives);
      return computed(() => (stateOfPrimitives[key] as any) as T);
    }
  };
}

function catchMissingState(key: string, state: any) {
  if (undefined == state[key]) throw Error(`Missing Cache Entry::${key}`);
}



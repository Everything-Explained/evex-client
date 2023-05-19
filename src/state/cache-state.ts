import { computed, reactive } from 'vue';

const stateOfArrays = reactive({
  temp: [],
  routeHistory: [],
  'lazyimg-data': [],
  'blog/public': [],
  'blog/red33m': [],
  changelog: [],
  qnaform: [],
  'literature/public': [],
  'literature/red33m': [],
  'videos/public': [],
  'videos/red33m': [],
  'videos/red33m-archive': [],
  '/data/videos/red33m': [],
  '/data/videos/red33m-archive': [],
  '/data/videos/public': [],
  'page-content': [],
  'ux-filter': [],
  'video-list-cache': [],
});

const stateOfObjects = reactive({});

const stateOfPrimitives = reactive({
  'home-page': '',
  'titlebar-menu-open': false,
  'red33m-video-list': 1,
});

export type DataCacheObjKeys = keyof typeof stateOfObjects;
export type DataCacheArrayKeys = keyof typeof stateOfArrays;
export type DataCacheKeys = keyof typeof stateOfPrimitives;

// NOTE: We are assuming that all contained non-primitive types will
//       NOT be mutated. E.g. [Object, Object] or { foo: ['bar'] }
export function useDataCache<T>() {
  function setArrayData(key: DataCacheArrayKeys, val: any[]) {
    catchMissingState(key as string, stateOfArrays);
    (stateOfArrays[key] as any[]) = val.slice();
  }

  function updArrayData(key: DataCacheArrayKeys, val: any) {
    catchMissingState(key as string, stateOfArrays);
    (stateOfArrays[key] as any[]).push(val);
  }

  function getArrayData(key: DataCacheArrayKeys) {
    catchMissingState(key as string, stateOfArrays);
    return computed(() => (stateOfArrays[key]?.slice() || []) as T[]);
  }

  // function setObjData (key: DataCacheObjKeys, val: any) {
  //   catchMissingState(key as string, stateOfObjects);
  //   stateOfObjects[key] = { ...val };
  // }

  // function updObjData (key: DataCacheObjKeys, prop: keyof T, val: any) {
  //   catchMissingState(key as string, stateOfObjects);
  //   const data = (stateOfObjects[key] as any)[prop];
  //   const hasSameType =
  //     (typeof data == typeof val) && (data instanceof Array == val instanceof Array)
  //   ;
  //   if (undefined == data) throw Error(`Property "${prop}" does not exist on Object`);
  //   if (!hasSameType)      throw Error('Value must be of the same type as the Object Property');
  //   (stateOfObjects[key] as any)[prop] = val;
  // }

  // function getObjData (key: DataCacheObjKeys) {
  //   catchMissingState(key as string, stateOfObjects);
  //   return computed(() => ({ ...(stateOfObjects[key] as any) } as T));
  // }

  function setData(key: DataCacheKeys, val: string | boolean | number) {
    catchMissingState(key as string, stateOfPrimitives);
    (stateOfPrimitives[key] as any) = val;
  }

  function getData(key: DataCacheKeys) {
    catchMissingState(key as string, stateOfPrimitives);
    return computed(() => stateOfPrimitives[key] as any as T);
  }

  function catchMissingState(key: string, state: any) {
    if (undefined == state[key]) throw Error(`Missing Cache Entry::${key}`);
  }

  return {
    setArrayData,
    updArrayData,
    getArrayData,
    // setObjData,   updObjData,   getObjData,
    setData,
    getData,
  };
}

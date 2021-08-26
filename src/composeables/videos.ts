import { APIResponse, useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDataCache } from "@/state/cache-state";
import { Ref, ref } from "@vue/reactivity";


export default function useVideos<T>(uri: DataCacheArrayKeys, onVideosReady: (videos: T[]) => void) {
  const dataCache = useDataCache<T>();
  const api       = useAPI();
  const videos    = ref(dataCache.getArrayData(uri).value) as Ref<T[]>;

  videos.value.length
    ? onVideosReady(videos.value)
    : api.get<T[]>(uri, null, 'static').then(cacheVideos)
  ;

  function cacheVideos(res: APIResponse<T[]>) {
    dataCache.setArrayData(uri, res.data);
    videos.value = res.data;
    onVideosReady(videos.value);
  }

  return {
    isLoadingVideos: api.isPending,
    videos,
  };
}
import { useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDataCache } from "@/state/cache-state";
import { Ref, ref } from "@vue/reactivity";


export default function useVideos<T>(uri: DataCacheArrayKeys) {
  const dataCache = useDataCache<T>();
  const api       = useAPI();
  const videos    = ref(dataCache.getArrayData(uri).value) as Ref<T[]>;

  if (!videos.value.length) {
    api
      .get<T[]>(uri, null, 'static')
      .then(res => {
        dataCache.setArrayData(uri, res.data);
        videos.value = res.data;
      });
  }

  return {
    isPending: api.isPending,
    isCached: !!videos.value.length,
    videos,
  };
}




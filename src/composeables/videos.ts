import { useAPI } from '@/services/api_internal';
import { DataCacheArrayKeys, useDataCache } from '@/state/cache-state';
import { Ref, ref } from 'vue';

export default function useVideos<T>(uri: DataCacheArrayKeys, version: string) {
  const dataCache = useDataCache<T>();
  const api = useAPI();
  const videos = ref(dataCache.getArrayData(uri).value) as Ref<T[]>;
  const isPending = ref(true);

  if (!videos.value.length) {
    api.get<T[]>(uri, null, version, 'static').then((res) => {
      videos.value = res.data;
      dataCache.setArrayData(uri, res.data);
      isPending.value = false;
    });
  }

  return {
    isPending,
    isCached: !!videos.value.length,
    videos,
  };
}

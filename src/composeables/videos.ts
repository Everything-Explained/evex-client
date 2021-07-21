import { useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDateCache } from "@/state/cache-state";


export default function useVideos<T>(uri: DataCacheArrayKeys, onVideosLoaded: () => void) {
  const dataCache = useDateCache<T>();
  const api       = useAPI();
  const videos    = dataCache.getArrayData(uri);

  if (!videos.value.length) {
    api.get<T[]>(uri, null, 'static')
       .then((res) => {
         dataCache.setArrayData(uri, res.data);
         onVideosLoaded();
      })
    ;
  }

  return {
    isLoadingVideos: api.isPending,
    videos,
  };
}
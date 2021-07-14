import { APIResponse, useAPI } from "@/services/api_internal";
import { DataCacheArrayKeys, useDateCache } from "@/state/cache-state";
import { computed } from "vue";
import { useTask } from "vue-concurrency";


export default function useVideos<T>(uri: DataCacheArrayKeys) {
  const dataCache = useDateCache<T>();
  const videos = dataCache.getArrayData(uri);
  const api    = useAPI();

  function getVideoTask(onVideosLoaded: () => void) {
    const videoTask = useTask(function*() {
      const resp: APIResponse<any[]> = yield api.get(`${uri}`, null, 'static');
      dataCache.setArrayData(uri, resp.data);
      onVideosLoaded();
    });
    return {
      isRunning: computed(() => videoTask.isRunning),
      loadVideos: () => {
        if (!videos.value.length) videoTask.perform();
        else onVideosLoaded();
      }
    };
  }

  return {
    videos,
    getVideoTask,
  };
}
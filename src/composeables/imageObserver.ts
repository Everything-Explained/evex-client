import { useDataCache } from "@/state/cache-state";
import { computed, reactive, ref } from "vue";


type IMGProps = {
  src: string;
  /** Is the image loaded from our CMS */
  asset: boolean
}


export function useImageObserver(props: IMGProps) {
  const imgRef        = ref<HTMLImageElement>();
  const containerRef  = ref<HTMLElement>();
  const dataCache     = useDataCache<string>();

  const state = reactive({
    img           : computed(() => imgRef.value!),
    loaded        : false,
    showPreloader : false,
    activeSrc     : computed(() => props.src!),
    cache         : dataCache.getArrayData('lazyimg-data'),
  });

  function isImageCached(uri: string) {
    if (!uri) return;
    const uriSlug = uri.split('//', 2)[1];
    return state.cache.find(v => v.includes(uriSlug));
  }

  function detectImageAssetSize() {
    if (props.asset) {
      const [width, height] = state.activeSrc.split('/')[5].split('x').map(v => parseInt(v));
      // The current max-width style set on content container
      const maxContentWidth = 1024;

      const winWidth = document.body.clientWidth;
      const contentWidth = winWidth > maxContentWidth ? maxContentWidth : winWidth;
      const ratio = width / height;

      if (width >= contentWidth) state.img.height = (contentWidth * 0.97) / ratio;
      else state.img.height = width / ratio;
    }
  }

  const updateImageSrc = () => state.img.src = state.activeSrc;
  function loadImage(entries: IntersectionObserverEntry[], obs: IntersectionObserver) {
    if (entries[0].isIntersecting) {
      obs.unobserve(containerRef.value!);
      if (isImageCached(state.activeSrc)) return updateImageSrc()
      ;
      state.showPreloader = true;
      // Provides a smoother transition with fast loading images
      setTimeout(updateImageSrc, 100);
      dataCache.updArrayData('lazyimg-data', state.activeSrc);
    }
  }

  const observer = new IntersectionObserver(loadImage);
  let loadEvents = true;
  function observeImage() {
    if (loadEvents) {
      state.img.addEventListener('load', () => state.loaded = true);
      state.img.addEventListener('animationend', () => state.showPreloader = false);
      loadEvents = false;
    }
    observer.observe(containerRef.value!);
  }

  return { state, imgRef, containerRef, observeImage, detectImageAssetSize };
}
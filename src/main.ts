/* eslint-disable */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import './styles/_main.css';
import { useAPI } from './services/api_internal';


const getElement = (id: string) => {
  return document.getElementById(id)!;
};


const browserIsSupported = (() => {
  const isValidBrowser =
       navigator.cookieEnabled != undefined
    && window['Promise']
    && window['DOMParser']
    && window['crypto']
    && document.body.dataset
    && document.importNode
  ;
  if (!isValidBrowser) {
    const el: HTMLElement = getElement('Failure');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


const cookiesAreEnabled = (() => {
  if (!navigator.cookieEnabled) {
    const el: HTMLElement = getElement('NoCookies');
    el.style.display = 'inline-block';
    return false;
  } return true;
})();


if (cookiesAreEnabled && browserIsSupported) {
  const api = useAPI();
  api.init();

  window['app'] = createApp(App)
    .use(router)
    .mount('#app')
  ;
}

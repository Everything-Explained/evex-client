

type ValidEvents = 'update-footer'|'update-menu';
type MenuEventRoutes = 'home'      | 'blog'       | 'support'   |
                      'lib-lit'   | 'lib-videos' | 'red-login' |
                      'red-lit'   | 'red-videos' | 'red-form'  |
                      'changelog' | '404'
;
type MenuEventCallback = (route: MenuEventRoutes, visibility: boolean) => void
type CallBack = (...args: any[]) => void;

const _events = ['update-footer', 'update-menu'];
const _subscribers: [event: string, cb: CallBack][] = [];


export function useEventBus() {

  function emit(ev: ValidEvents, ...args: any[]) {
    if (_events.includes(ev)) {
      _subscribers.forEach(sub => sub[0] == ev && sub[1](...args));
      return;
    }
    throw Error(`Missing Event::"${ev}"`);
  }

  function on(ev: ValidEvents, cb: (...args: any[]) => void) {
    const addedSub = _events.includes(ev) && !!_subscribers.push([ev, cb]);
    if (!addedSub) throw Error(`Missing Event::"${ev}"`);
  }

  return {
    off: (cb: CallBack) => {
      _subscribers.forEach((sub, i) => sub[1] == cb && _subscribers.splice(i, 1));
    },
    onUpdateMenu:   (cb: MenuEventCallback)                      => on('update-menu', cb),
    updateMenu:     (route: MenuEventRoutes, visibility: boolean) => emit('update-menu', route, visibility),
    onUpdateFooter: (cb: CallBack)                               => on('update-footer', cb),
    updateFooter:   ()                                           => emit('update-footer'),
  };
}
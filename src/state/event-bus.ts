

type ValidEvents = 'update-footer'|'update-menu';
type CallBack    = (...args: any[]) => void;

const _events = ['update-footer', 'update-menu'];
const _subscribers: [event: string, cb: CallBack][] = [];


export function useEventBus() {
  return {
    on: (ev: ValidEvents, cb: CallBack) => {
      const addedSub = _events.includes(ev) && !!_subscribers.push([ev, cb]);
      if (!addedSub) throw Error(`Missing Event::"${ev}"`);
    },
    off: (cb: CallBack) => {
      _subscribers.forEach((sub, i) => sub[1] == cb && _subscribers.splice(i, 1));
    },
    emit: (ev: ValidEvents, ...args: any[]) => {
      if (_events.includes(ev)) {
        _subscribers.forEach(sub => sub[0] == ev && sub[1](...args));
        return;
      }
      throw Error(`Missing Event::"${ev}"`);
    }
  };
}
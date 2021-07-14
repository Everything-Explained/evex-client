

type ValidEvents = 'update-footer';
const _events: [ValidEvents] = ['update-footer'];
const _subscribers: [event: string, callback: () => void][] = [];


export function useEventBus() {
  return {
    on: (ev: ValidEvents, cb: () => void) => {
      const addedSub = _events.includes(ev) && !!_subscribers.push([ev, cb]);
      if (!addedSub) throw Error(`Missing Event::"${ev}"`);
    },
    off: (cb: () => void) => {
      _subscribers.forEach((sub, i) => sub[1] == cb && _subscribers.splice(i, 1));
    },
    emit: (ev: ValidEvents) => {
      if (_events.includes(ev)) {
        _subscribers.forEach(sub => sub[0] == ev && sub[1]());
        return;
      }
      throw Error(`Missing Event::"${ev}"`);
    }
  };
}
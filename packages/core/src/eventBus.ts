import { findIndex } from './array';

type Callback = (...args: any[]) => void;

export class EventBus {
  private static instance?: EventBus;
  private events: { [key: string]: Array<Callback> } = {};

  public static get Ins(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public getCallbackList(eventName: string): Callback[] {
    if (!Array.isArray(this.events[eventName])) {
      this.events[eventName] = [];
    }
    return this.events[eventName] as Callback[];
  }

  on(eventName: string, callback: Callback) {
    const list = this.getCallbackList(eventName);
    list.push(callback);
  }

  once(eventName: string, callback: Callback) {
    const callbackWra = (...params: any[]) => {
      callback(...params);
      this.off(eventName, callbackWra);
    };
    const list = this.getCallbackList(eventName);
    list.push(callbackWra);
  }

  times(times: number, eventName: string, callback: Callback) {
    const callbackWra = () => {
      let count = 0;
      const newCallBack = (...params: any[]) => {
        callback(...params);
        count++;
        if (count === times) {
          this.off(eventName, newCallBack);
        }
      };
      return newCallBack;
    };
    const list = this.getCallbackList(eventName);
    list.push(callbackWra());
  }

  emit(eventName: string, ...params: any[]) {
    // console.log('eventBus emit', eventName);
    const list = this.getCallbackList(eventName);
    list.forEach((item) => {
      item(...params);
    });
  }

  off(eventName: string, callback: Callback) {
    const list = this.getCallbackList(eventName);
    const index = findIndex(list, (i) => i === callback);
    index > -1 && list.splice(index, 1);
  }

  offAll() {
    this.events = {};
  }
}

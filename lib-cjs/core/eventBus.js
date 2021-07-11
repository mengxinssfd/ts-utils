"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
const array_1 = require("./array");
class EventBus {
    constructor() {
        this.events = {};
    }
    static get Ins() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    getCallbackList(eventName) {
        if (!Array.isArray(this.events[eventName])) {
            this.events[eventName] = [];
        }
        return this.events[eventName];
    }
    on(eventName, callback) {
        const list = this.getCallbackList(eventName);
        list.push(callback);
    }
    once(eventName, callback) {
        const callbackWra = (...params) => {
            callback(...params);
            this.off(eventName, callbackWra);
        };
        const list = this.getCallbackList(eventName);
        list.push(callbackWra);
    }
    times(times, eventName, callback) {
        const callbackWra = () => {
            let count = 0;
            const newCallBack = (...params) => {
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
    emit(eventName, ...params) {
        // console.log('eventBus emit', eventName);
        const list = this.getCallbackList(eventName);
        list.forEach(item => {
            item(...params);
        });
    }
    off(eventName, callback) {
        const list = this.getCallbackList(eventName);
        let index = array_1.findIndex(i => i === callback, list);
        (index > -1) && list.splice(index, 1);
    }
    offAll() {
        this.events = {};
    }
}
exports.EventBus = EventBus;

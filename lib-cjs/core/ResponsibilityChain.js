"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsibilityChain = void 0;
const dataType_1 = require("./dataType");
var State;
(function (State) {
    State["ready"] = "ready";
    State["running"] = "running";
    State["done"] = "done";
})(State || (State = {}));
/**
 * 责任链
 */
class ResponsibilityChain {
    constructor(chain, initValue, onDone) {
        this.initValue = initValue;
        this.onDone = onDone;
        this._status = State.ready;
        this.next = (value) => {
            const { chain } = this;
            this._value = value;
            if (this.index >= chain.length - 1) {
                this.done();
                return;
            }
            this.index++;
            this.run();
        };
        this.done = (value = this.value) => {
            const { onDone, index } = this;
            this._status = State.done;
            onDone && onDone(value, index);
        };
        this.chain = chain.map(c => (0, dataType_1.isFunction)(c) ? { handler: c } : c);
    }
    get value() {
        return this._value;
    }
    get status() {
        return this._status;
    }
    start(value) {
        if (this._status === State.running)
            return this;
        this.initValue = value !== null && value !== void 0 ? value : this.initValue;
        this._value = value !== null && value !== void 0 ? value : this.initValue;
        this.index = 0;
        this._status = State.running;
        this.run();
        return this;
    }
    run() {
        const { chain, index, next, done, value, initValue } = this;
        const { handler } = chain[index];
        handler(value, next, done, initValue);
    }
    ;
}
exports.ResponsibilityChain = ResponsibilityChain;
ResponsibilityChain.State = State;

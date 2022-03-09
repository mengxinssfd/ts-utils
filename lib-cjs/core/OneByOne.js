"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneByOne = void 0;
var ONE_BY_ONE_STATE;
(function (ONE_BY_ONE_STATE) {
    ONE_BY_ONE_STATE[ONE_BY_ONE_STATE["default"] = 0] = "default";
    ONE_BY_ONE_STATE[ONE_BY_ONE_STATE["pause"] = 1] = "pause";
    ONE_BY_ONE_STATE[ONE_BY_ONE_STATE["stop"] = 2] = "stop";
})(ONE_BY_ONE_STATE || (ONE_BY_ONE_STATE = {}));
class OneByOne {
    constructor(sayWord, config) {
        this.status = ONE_BY_ONE_STATE.default;
        this.joinWord = "";
        this.sayWord = sayWord;
        this.wordArr = sayWord.split("");
        this.config = config;
    }
    run() {
        const handler = () => {
            if (this.status !== ONE_BY_ONE_STATE.default)
                return;
            const word = this.wordArr.shift();
            this.joinWord += word;
            let len = this.wordArr.length;
            let keepRun = !!len;
            if (this.config.callback) {
                const flag = this.config.callback.call(this, word, this.joinWord, this.sayWord);
                if (len && flag === false) {
                    this.status = ONE_BY_ONE_STATE.pause;
                }
                keepRun = !!len && flag !== false;
            }
            else {
                console.log(word);
            }
            // 播放过一遍后，设为停止状态
            if (!len) {
                this.status = ONE_BY_ONE_STATE.stop;
                if (this.config.loop) {
                    this.replay();
                }
                return;
            }
            if (keepRun)
                this.run();
        };
        this.timer = window.setTimeout(handler, this.config.delay);
    }
    play() {
        if (this.status === ONE_BY_ONE_STATE.stop)
            return;
        this.status = ONE_BY_ONE_STATE.default;
        this.run();
    }
    replay() {
        clearTimeout(this.timer);
        this.status = ONE_BY_ONE_STATE.default;
        this.wordArr = this.sayWord.split("");
        this.joinWord = "";
        this.run();
    }
    pause() {
        if (this.status === ONE_BY_ONE_STATE.stop)
            return;
        this.status = ONE_BY_ONE_STATE.pause;
        clearTimeout(this.timer);
    }
    stop() {
        if (this.status !== ONE_BY_ONE_STATE.default)
            return;
        this.status = ONE_BY_ONE_STATE.stop;
        clearTimeout(this.timer);
    }
}
exports.OneByOne = OneByOne;

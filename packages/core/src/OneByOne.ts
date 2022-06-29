/**
 * 将字符串按一定的时间间隔逐字输出 如：仿打字效果
 * @Author: dyh
 * @Date: 2019-10-23 9:12
 * @Description:
 */
interface OneByOneConfig {
  delay: number;
  loop?: boolean;
  callback?: (word: string, joinWord: string, sayWord: string) => boolean | undefined;
}

enum ONE_BY_ONE_STATE {
  'default',
  'pause',
  'stop',
}

export class OneByOne {
  sayWord: string;
  private wordArr: string[];
  private timer!: number;
  status = ONE_BY_ONE_STATE.default;
  config: OneByOneConfig;
  joinWord = '';

  constructor(sayWord: string, config: OneByOneConfig) {
    this.sayWord = sayWord;
    this.wordArr = sayWord.split('');
    this.config = config;
  }

  private run() {
    const handler = () => {
      if (this.status !== ONE_BY_ONE_STATE.default) return;
      const word = this.wordArr.shift() as string;
      this.joinWord += word;
      const len = this.wordArr.length;
      let keepRun = !!len;
      if (this.config.callback) {
        const flag = this.config.callback.call(this, word, this.joinWord, this.sayWord);
        if (len && flag === false) {
          this.status = ONE_BY_ONE_STATE.pause;
        }
        keepRun = !!len && flag !== false;
      } else {
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
      if (keepRun) this.run();
    };
    this.timer = window.setTimeout(handler, this.config.delay);
  }

  public play() {
    if (this.status === ONE_BY_ONE_STATE.stop) return;
    this.status = ONE_BY_ONE_STATE.default;
    this.run();
  }

  public replay() {
    clearTimeout(this.timer);
    this.status = ONE_BY_ONE_STATE.default;
    this.wordArr = this.sayWord.split('');
    this.joinWord = '';
    this.run();
  }

  public pause() {
    if (this.status === ONE_BY_ONE_STATE.stop) return;
    this.status = ONE_BY_ONE_STATE.pause;
    clearTimeout(this.timer);
  }

  public stop() {
    if (this.status !== ONE_BY_ONE_STATE.default) return;
    this.status = ONE_BY_ONE_STATE.stop;
    clearTimeout(this.timer);
  }
}

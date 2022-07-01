import { isFunction } from './dataType';

type Next<T> = (value: T) => void;
type Done<T> = (value?: T | unknown) => void;
type OnDone<T> = (value: T | unknown, index: number) => void;
type ChainHandler<T> = (value: T, next: Next<T>, done: Done<T>, initValue?: T) => void;
interface ChainItem<T> {
  handler: ChainHandler<T>;
  // 或许以后可以根据name调用
  name?: string;
  // 说明字段，不使用
  desc?: string;
}
type Chain<T> = Array<ChainItem<T>>;

enum State {
  ready = 'ready',
  running = 'running',
  done = 'done',
}

/**
 * 责任链
 */
export class ResponsibilityChain<T> {
  static readonly State = State;
  private chain!: Chain<T>;
  private index!: number;
  private _value!: T;

  get value(): T {
    return this._value;
  }

  private _status: State = State.ready;

  get status(): State {
    return this._status;
  }

  constructor(
    chain: Array<ChainItem<T> | ChainHandler<T>>,
    private initValue?: T,
    public onDone?: OnDone<T>,
  ) {
    this.chain = chain.map((c) => (isFunction(c) ? { handler: c } : c));
  }

  start(value?: T) {
    if (this._status === State.running) return this;
    this.initValue = value ?? this.initValue;
    this._value = value ?? (this.initValue as T);
    this.index = 0;
    this._status = State.running;
    this.run();
    return this;
  }

  private run() {
    const { chain, index, next, done, value, initValue } = this;
    const { handler } = chain[index];
    handler(value, next, done, initValue);
  }

  private next: Next<T> = (value: T) => {
    const { chain } = this;
    this._value = value;
    if (this.index >= chain.length - 1) {
      this.done();
      return;
    }
    this.index++;
    this.run();
  };

  private done: Done<T> = (value = this.value) => {
    const { onDone, index } = this;
    this._status = State.done;
    onDone && onDone(value, index);
  };
}

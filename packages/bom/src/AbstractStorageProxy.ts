interface Value {
  value: string;
  exp: number;
}

/**
 * localStorage和sessionStorage的代理类，支持设置过期时间和加密key value
 * 采用什么加密解密需要自己实现
 * 注意：就算设置了过期时间，如果一直不取的话，会一直保存在本地
 */
export abstract class AbstractStorageProxy implements Storage {
  protected constructor(protected storage: Storage) {}
  protected abstract encodeKey(key: string): string;
  protected abstract encodeValue(value: string): string;
  protected abstract decodeValue(value: string | null): string | null;
  protected parseValue(encodedKey: string, value: string | null): string | null {
    if (!value) return null;

    const v = JSON.parse(value) as Value;

    if (v.exp < Date.now()) {
      this.storage.removeItem(encodedKey);
      return null;
    }
    return v.value;
  }
  protected handleValue(value: string, expired?: Date | number): string {
    let exp: number;
    switch (typeof expired) {
      case 'number':
        exp = Date.now() + expired;
        break;
      case 'undefined':
        exp = Number.MAX_SAFE_INTEGER;
        break;
      default:
        exp = expired.getTime();
    }
    const v: Value = { value, exp };
    return JSON.stringify(v);
  }
  get length(): number {
    return this.storage.length;
  }
  setItemWithExp(key: string, value: string, expire?: Date | number): void {
    const encodedKey = this.encodeKey(key);
    value = this.handleValue(value, expire);
    const encodedValue = this.encodeValue(value);
    this.storage.setItem(encodedKey, encodedValue);
  }
  setItem(key: string, value: string): void {
    this.setItemWithExp(key, value);
  }
  getItem(key: string): string | null {
    const encodedKey = this.encodeKey(key);
    let value = this.storage.getItem(encodedKey);
    value = this.decodeValue(value);
    return this.parseValue(encodedKey, value);
  }
  key(index: number): string | null {
    return this.storage.key(index);
  }
  removeItem(key: string): void {
    this.storage.removeItem(this.encodeKey(key));
  }
  clear(): void {
    this.storage.clear();
  }
}

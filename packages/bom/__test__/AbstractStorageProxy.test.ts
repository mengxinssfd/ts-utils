import { AbstractStorageProxy } from '../src/AbstractStorageProxy';
import CryptoJS from 'crypto-js';
import { sleep } from '@mxssfd/core';

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('3333e6e143439161');
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('e3bbe7e3ba84431a');

/**
 * 解密方法
 * @param value
 */
export function decrypt(value: string): string {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(value);
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

/**
 * 加密方法
 * @param value
 */
export function encrypt(value: string) {
  const dataHex = CryptoJS.enc.Utf8.parse(value);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
}

class StorageProxy extends AbstractStorageProxy {
  constructor(storage: Storage) {
    super(storage);
  }
  protected encodeKey(key: string): string {
    return encrypt(key);
  }
  protected encodeValue(value: string): string {
    return encrypt(value);
  }
  protected decodeValue(value: string | null): string | null {
    if (value === null) return null;
    return decrypt(value);
  }
}

function testBase(storage: Storage) {
  const sp = new StorageProxy(storage);

  sp.setItem('test', '111');
  expect(sp.getItem('test')).toBe('111');
  expect(storage.getItem('test')).not.toBe('111');
  expect(sp.key(0)).not.toBe('111');
  expect(sp.length).toBe(1);
  expect(storage.length).toBe(1);

  sp.clear();
  expect(sp.getItem('test')).toBe(null);
  expect(sp.length).toBe(0);

  sp.setItem('test', '111');
  expect(sp.length).toBe(1);

  sp.removeItem('test');
  expect(sp.length).toBe(0);
}
describe('AbstractStorageProxy', () => {
  test('base localStorage', () => {
    testBase(localStorage);
  });
  test('base sessionStorage', () => {
    testBase(sessionStorage);
  });
  test('external storage', () => {
    const storage = new StorageProxy(localStorage);
    localStorage.setItem('test', '111');
    // 拿不到 因为原生的key未加密是未处理过的key
    expect(storage.getItem('test')).toBe(null);

    // b25a2e804d592bf6772a733661108db5是test转换过的值
    localStorage.setItem('b25a2e804d592bf6772a733661108db5', '222');
    expect(storage.getItem('test')).toBe(null);
  });
  test('expire', async () => {
    const storage = new StorageProxy(localStorage);

    storage.setItemWithExp('test', '111', 10);
    storage.setItemWithExp('test2', '222', new Date(Date.now() + 20));

    expect(storage.getItem('test')).toBe('111');
    expect(storage.getItem('test2')).toBe('222');

    await sleep(5);
    expect(storage.getItem('test')).toBe('111');
    expect(storage.getItem('test2')).toBe('222');

    await sleep(6);
    expect(storage.getItem('test')).toBe(null);
    expect(storage.getItem('test2')).toBe('222');

    await sleep(10);
    expect(storage.getItem('test')).toBe(null);
    expect(storage.getItem('test2')).toBe(null);
  });
});
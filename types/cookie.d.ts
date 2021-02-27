/**
 *
 * @param name cookie name
 * @param value cookie value
 * @param expire 过期秒数
 * @param path
 */
export declare function setCookie(name: string, value: string, expire: number, path?: string): void;
export declare function getCookie(name: string): string;
export declare function deleteCookie(c_name: any): void;

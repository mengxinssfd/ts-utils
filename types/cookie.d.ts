export declare class Cookie {
    /**
     * @param name cookie name
     * @param value cookie value
     * @param expire 过期秒数
     * @param path cookie path
     */
    static set(name: string, value: string, expire: number, path?: string): void;
    static get(name: string): string;
    static remove(name: string): void;
}

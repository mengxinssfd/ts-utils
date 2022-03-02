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
declare enum ONE_BY_ONE_STATE {
    'default' = 0,
    'pause' = 1,
    'stop' = 2
}
export declare class OneByOne {
    sayWord: string;
    private wordArr;
    private timer;
    status: ONE_BY_ONE_STATE;
    config: OneByOneConfig;
    joinWord: string;
    constructor(sayWord: string, config: OneByOneConfig);
    private run;
    play(): void;
    replay(): void;
    pause(): void;
    stop(): void;
}
export {};

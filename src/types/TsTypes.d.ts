// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir#

export type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;

// 找出readonly属性
export type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];

// 找出非readonly属性
export type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

// type A = {
//     readonly a: string,
//     b: number
// }
// type b = WritableKeys<A> // => type b = "b";

export type RequiredKeys<T> = {
    [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? never : K)
}[keyof T]

export type OptionalKeys<T> = {
    [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

export type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>

// type I3 = {
//     a: string,
//     b?: number,
//     c: boolean | undefined
// }
//
// type I4 = ExcludeOptionalProps<I3>; // => type I4 = {a: string; c: boolean | undefined}
// type I5 = OptionalKeys<I3>; // type I5 = "b"

export type PublicOnly<T> = Pick<T, keyof T>; // seems like a no-op but it works
// class Foo {
//     public a = "";
//     protected b = 2;
//     private c = false;
//
//     constructor() {
//         console.log(this.c);
//     }
// }
// type PublicFoo = PublicOnly<Foo>; // {a: string}

export type SettableStyle = Partial<Omit<CSSStyleDeclaration, ReadonlyKeys<CSSStyleDeclaration>>>;

export type SettableProps<R extends HTMLElement> = ({ style?: SettableStyle } & Partial<Omit<R, "style" | ReadonlyKeys<R>>>);

// 类似trim ".123" => "123" | "123." => 123
export type DotTrim<T> = T extends `${infer U}.` | `.${infer U}` ? DotTrim<U> : T;
// type dt = DotTrim<".d.e.f"> // d.e.f
// type dt2 = DotTrim<"a..."> // a


// 如果T为空则返回空，不为空返回默认
// EmptyNotDef<"", "123"> // ""
// EmptyNotDef<"123", "333"> // 333
export type EmptyNotDef<T, D> = T extends "" ? T : D;
// type ed = EmptyNotDef<"", "123"> // ""
// type ed2 = EmptyNotDef<"123", "333"> // 333

// []转为""
export type BracketsToEmpty<T> = T extends `[]${infer U}` ? BracketsToEmpty<U> : T;
// type bte = BracketsToEmpty<"[][][]"> // ""

// 移除S中开头的START 相当于S.replace(new RegExp(`^${Start}`), "");
export type RemoveStrStart<S extends string, START extends string> = S extends `${START}${infer U}` ? U : S;
// type rss1 = RemoveStrStart<"anyScript", "any">; // Script
// type rss2 = RemoveStrStart<"anyScript", "Any">; // anyScript

/**
 * 获取两个Object中重复的key name
 * @example
 * DuplicateKeys<{a:string}, {b:string}>; // never
 * DuplicateKeys<{a:string}, {a:string}>; // "a"
 * DuplicateKeys<{a:string;b:string}, {a:string}>; // "a"
 * DuplicateKeys<{a:string;b:string}, {a:string;b:string}>; // "a"|"b"
 */
export type DuplicateKeys<A, B> = { [P in keyof A]-?: P extends keyof B ? P : never }[keyof A];

/**
 * 排查两个Object中是否有重复的key name，有就返回重复的key name集合，否则返回合并之后的Object
 * @example
 * CheckDuplicateKey2<{a:string},{b:string}>; // A & B
 * CheckDuplicateKey2<{a:string},{a:string}>; // never
 */
type CheckDuplicateKey2<A, B> = DuplicateKeys<A, B> extends never ? A & B : DuplicateKeys<A, B>;

type CheckDuplicateKey3<A, B, C> = CheckDuplicateKey2<A, B> extends A & B ? CheckDuplicateKey2<C, CheckDuplicateKey2<A, B>> : CheckDuplicateKey2<A, B>;
type CheckDuplicateKey4<A, B, C, D> = CheckDuplicateKey3<A, B, C> extends A & B & C ? CheckDuplicateKey2<D, CheckDuplicateKey3<A, B, C>> : CheckDuplicateKey3<A, B, C>;
type CheckDuplicateKey5<A, B, C, D, E> = CheckDuplicateKey4<A, B, C, D> extends A & B & C & D ? CheckDuplicateKey2<E, CheckDuplicateKey4<A, B, C, D>> : CheckDuplicateKey4<A, B, C, D>;

/**
 * 排查最多5个最少2个Object中是否有重复的key name，有就返回重复的key name集合，否则返回合并之后的Object
 * @tips 多个object key重复时不一定会全部显示重复的key name出来，可能会去掉一个重复的key才会出现下一个重复的
 * @example
 * CheckDuplicateKey<{ a: 1 }, { b: 2, e: 5 }, { c: 3 }, { d: 4 }, { e: 5, c: 3, d: 4 }> // 'e' | 'c' | 'd'
 */
export type CheckDuplicateKey<A, B = {}, C = {}, D = {}, E = {}> = CheckDuplicateKey5<A, B, C, D, E>;

/**
 * 从元组中移除第一个item的类型
 * @example
 * type t = ShiftTuple<[number, string]> // [string]
 */
export type ShiftTuple<T> = T extends [unknown, ...infer Rest] ? Rest : never;
/**
 * 从函数参数中移除第一个参数类型
 * @example
 * type p = OmitFirstParameters<(a:number, b:string)=>any>; // [b:string]
 */
export type OmitFirstParameters<T> = T extends (_: any, ...args: infer I) => any ? I : never;

/**
 * 返回一个由单一类型组成的元组
 * @example
 * type T = Tuple<number, 3> // => [number, number, number]
 * type T2 = Tuple<string, 2> // => [string, string]
 */
export type Tuple<T, N extends number, R extends unknown[] = []> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;
// export type Tuple<T, N extends number, R extends unknown[] = []> =
//     N extends N  // 第一个是分发, N可能是个union
//         ? number extends N // 第二个是N为any时降级
//             ? T[]
//             : R['length'] extends N ? R : Tuple<T, N, [T, ...R]>
//         : never;

// type T = Tuple<number, 1> // => [number, number, number]
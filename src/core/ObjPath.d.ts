// reference https://mp.weixin.qq.com/s/KJdUdwbLN4g4M7xy34m-fA
import {BracketsToEmpty, DotTrim, EmptyNotDef} from "../TsTypes";

type OneLevelPathOf<T> = keyof T & (string | number)
type PathForHint<T> = OneLevelPathOf<T>;

// P 参数是一个状态容器，用于承载每一步的递归结果，并最终帮我们实现尾递归
export type PathOf<T, K extends string, P extends string = ""> =
    K extends `${infer U}.${infer V}`
        ? U extends keyof T  // Record
            ? PathOf<T[U], V, `${P}${U}.`>
            : T extends unknown[]  // Array
                ? PathOf<T[number], V, `${P}${number}.`>
                : `${P}${PathForHint<T>}`  // 走到此分支，表示参数有误，提示用户正确的参数
        : K extends keyof T
            ? `${P}${K}`
            : T extends unknown[]
                ? `${P}${number}`
                : `${P}${PathForHint<T>}`;  // 走到此分支，表示参数有误，提示用户正确的参数

// type DotPath<P extends string = ""> = P extends `${infer V}.${infer O}` ? `${V}.${DotPath<O>}` : P;
// type BracketsPath<P extends string = ""> = P extends `${infer V}[${infer O}]` ? `${V}.${BracketsPath<O>}` : P
/**
 * 参考该文章改的路径转换type
 * @example
 * type fp = TransferPath<`[a]`>; // a
 * type fp1 = TransferPath<`[a][b][c]`>; // a.b.c
 * type fp2 = TransferPath<`a.b.c`>; // a.b.c
 * type fp3 = TransferPath<`a[b]`>; // a.b
 * type fp4 = TransferPath<`a.[b]`>; // a.b
 * type fp5 = TransferPath<`[a][b][c`>; // error a.b.[c
 * type fp6 = TransferPath<`a[b][c]`>; // a.b.c
 * type fp7 = TransferPath<`a[b]c`>; // a.b.c
 * type fp8 = TransferPath<`a[b].c`>; // a.b.c
 * type fp9 = TransferPath<`[a][b]c`>; // a.b.c
 */
export type TransferPath<P extends string, Path = DotTrim<P>> = // Path不能传参
    Path extends `[${infer K}]${infer NextK}`
        ? NextK extends "" ? `${K}` : `${K}${EmptyNotDef<NextK, `.${TransferPath<NextK>}`>}` // [a][b] => a.b
        : Path extends `${infer K}[${infer NextK}]${infer Other}`
            ? `${K}${EmptyNotDef<NextK, `.${NextK}`>}${EmptyNotDef<BracketsToEmpty<Other>, `.${TransferPath<Other>}`>}` // a[b] => a.b | a.[b] => a.b | a[b].c => a.b.c
            : Path extends `${infer K}.${infer NextK}` ? `${K}.${TransferPath<NextK>}` : Path; // a.b => a.b

// type tp1 = TransferPath<"a[b][c].d[e][f]">
// type tp2 = TransferPath<".d.e.f">
// type tp3 = TransferPath<"a[b][c].d.e.f">
// type tp4 = TransferPath<"a[][][]">
// type tp5 = TransferPath<"a...">

/*export type FormatPath<P extends string, R extends string = ""> =
    P extends `[${infer K}].${infer NextK}` | `[${infer K}]${infer NextK}` | `${infer K}.[${infer NextK}]`
        ? FormatPath<NextK, `${R}${K}${NextK extends "" ? "" : "."}`>
        : P extends `${infer K}[${infer NextK}].${infer Other}`
            ? FormatPath<Other, `${R}${K}.${NextK}${Other extends `` ? `` : `.`}`>
            : P extends `${infer K}[${infer NextK}]${infer Other}`
                ? FormatPath<Other, `${R}${K}.${NextK}${Other extends `` ? `` : `.`}`>
                : P extends `${infer K}.${infer NextK}`
                    ? FormatPath<NextK, `${R}${K}${NextK extends "" ? "" : "."}`>
                    : `${R}${P}`;*/

// type TS<P> = P extends `${infer K}[${infer NextK}].${infer Other}` ? `${K}.${NextK}.${Other}` : "B"
// type fp = FormatPath2<`[a]`>; // a
// type fp1 = FormatPath2<`[a][b][c]`>; // a.b.c
// type fp2 = FormatPath2<`a.b.c`>; // a.b.c
// type fp3 = FormatPath2<`a[b]`>; // a.b
// type fp4 = FormatPath2<`a.[b]`>; // a.b
// type fp5 = FormatPath2<`[a][b][c`>; // error a.b.[c
// type fp6 = FormatPath2<`a[b][c]`>; // a.b.c
// type fp7 = FormatPath2<`a[b]c`>; // a.b.c
// type fp8 = FormatPath2<`a[b].c`>; // a.b.c
// type fp9 = FormatPath2<`[a][b]c`>; // a.b.c
// type fp88 = TS<`a[b].c`>; // a.b.c
/**
 * Recursively convert objects to tuples, like
 * `{ name: { first: string } }` -> `['name'] | ['name', 'first']`
 */
type RecursivelyTuplePaths<NestedObj> = NestedObj extends (infer ItemValue)[] // Array 情况
    // Array 情况需要返回一个 number，然后继续递归
    ? [number] | [number, ...RecursivelyTuplePaths<ItemValue>] // 完全类似 JS 数组构造方法
    : NestedObj extends Record<string, any> // Record 情况
        ?
        // record 情况需要返回 record 最外层的 key，然后继续递归
        | [keyof NestedObj]
        | {
        [Key in keyof NestedObj]: [Key, ...RecursivelyTuplePaths<NestedObj[Key]>];
    }[Extract<keyof NestedObj, string>]
        // 此处稍微有些复杂，但做的事其实就是构造一个对象，value 是我们想要的 tuple
        // 最后再将 value 提取出来
        // 既不是数组又不是 record 时，表示遇到了基本类型，递归结束，返回空 tuple。
        : [];

/**
 * Flatten tuples created by RecursivelyTupleKeys into a union of paths, like:
 * `['name'] | ['name', 'first' ] -> 'name' | 'name.first'`
 */
type FlattenPathTuples<PathTuple extends unknown[]> = PathTuple extends []
    ? never
    : PathTuple extends [infer SinglePath] // 注意，[string] 是 Tuple
        ? SinglePath extends string | number // 通过条件判断提取 Path 类型
            ? `${SinglePath}`
            : never
        : PathTuple extends [infer PrefixPath, ...infer RestTuple] // 是不是和数组解构的语法很像？
            ? PrefixPath extends string | number // 通过条件判断继续递归
                ? `${PrefixPath}.${FlattenPathTuples<Extract<RestTuple, (string | number)[]>>}`
                : never
            : string;

/** 获取嵌套对象的全部子路径 */
type AllPathsOf<NestedObj> = object extends NestedObj
    ? never
    // 先把全部子路径组织成 tuple union，再把每一个 tuple 展平为 Template Literal Type
    : FlattenPathTuples<RecursivelyTuplePaths<NestedObj>>;

/** 给定子路径和嵌套对象，获取子路径对应的 value 类型 */
export type ValueMatchingPath<NestedObj, Path extends AllPathsOf<NestedObj>> =
    string extends Path
        ? any
        : object extends NestedObj
            ? any
            : NestedObj extends readonly (infer SingleValue)[] // Array 情况
                ? Path extends `${string}.${infer NextPath}`
                    ? NextPath extends AllPathsOf<NestedObj[number]> // Path 有嵌套情况，继续递归
                        ? ValueMatchingPath<NestedObj[number], NextPath>
                        : never
                    : SingleValue // Path 无嵌套情况，数组的 item 类型就是目标结果
                : Path extends keyof NestedObj // Record 情况
                    ? NestedObj[Path] // Path 是 Record 的 key 之一，则可直接返回目标结果
                    : Path extends `${infer Key}.${infer NextPath}` // 否则继续递归
                        ? Key extends keyof NestedObj
                            ? NextPath extends AllPathsOf<NestedObj[Key]> // 通过两层判断进入递归
                                ? ValueMatchingPath<NestedObj[Key], NextPath>
                                : never
                            : never
                        : never;

export type TypeOfPath<T, K extends string> =
    K extends `${infer A}.${infer B}`
        ? A extends keyof T ? TypeOfPath<T[A], B> : (T extends Array<infer I> ? TypeOfPath<I, B> : never)
        : K extends keyof T ? T[K] : (T extends Array<infer I> ? I : never);

// type Test2 = `names.${number}.firstName.lastName.${number}`;
type SplitTemplateStringTypeToTuple<T> =
    T extends `${infer First}.${infer Rest}`
        // 此分支表示需要继续递归
        ? First extends `${number}`
            ? [number, ...SplitTemplateStringTypeToTuple<Rest>] // 完全类似 JS 数组构造
            : [First, ...SplitTemplateStringTypeToTuple<Rest>]
        // 此分支表示抵达递归基，递归基不是 number 就是 string
        : T extends `${number}`
            ? [number]
            : [T];
// type Test3 = `${number}.${number}`
// type TestSplitTemplateStringTypeToTuple = SplitTemplateStringTypeToTuple<Test3>;


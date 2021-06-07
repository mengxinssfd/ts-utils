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

export type SettableProps<R extends HTMLElement> =
    { style?: SettableStyle }
    & Partial<Omit<R, "style" | ReadonlyKeys<R>>>;
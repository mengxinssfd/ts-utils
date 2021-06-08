export declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
export declare type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, never, P>;
}[keyof T];
export declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
export declare type RequiredKeys<T> = {
    [K in keyof T]-?: ({} extends {
        [P in K]: T[K];
    } ? never : K);
}[keyof T];
export declare type OptionalKeys<T> = {
    [K in keyof T]-?: ({} extends {
        [P in K]: T[K];
    } ? K : never);
}[keyof T];
export declare type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>;
export declare type PublicOnly<T> = Pick<T, keyof T>;
export declare type SettableStyle = Partial<Omit<CSSStyleDeclaration, ReadonlyKeys<CSSStyleDeclaration>>>;
export declare type SettableProps<R extends HTMLElement> = ({
    style?: SettableStyle;
} & Partial<Omit<R, "style" | ReadonlyKeys<R>>>);

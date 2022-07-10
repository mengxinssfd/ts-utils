export type UrlParams<T, R = {}> = T extends `${infer K}=${infer V}${infer Other}`
  ? UrlParams<Other extends `&${infer O}` ? O : Other, { [k in K]: V }> & R
  : R;

// type test = UrlParams<'a=1&b=2'>;

// 联想到rust的
// let c:i32 = test(); // c:i32
// let c:u8 = test(); // u8

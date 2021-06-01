"use strict";
// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir#
Object.defineProperty(exports, "__esModule", { value: true });
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

import {at} from "./common";
import {OmitFirstParameters} from "../types/TsTypes";
import {findIndex} from "./array";

export function useArray<T>(arr: T[]) {
    return {
        at(...args:OmitFirstParameters<typeof at>) {
            return at(arr,...args);
        },
        findIndex(predicate){
            return findIndex(predicate,arr);
        }
    };
}

import LookupArrayMethods from "../../../constants/lookupMethods/array";
import LookupTypedArrayMethods from "../../../constants/lookupMethods/typedArray";
import { tryToGetRaw } from "../../utils";
import { TypedArray } from "../../../types/types";

type LookupKey<T> = T extends any[] ?
  typeof LookupArrayMethods[number] :
  typeof LookupTypedArrayMethods[number];

function lookupArrayHandler<T extends any[] | TypedArray>(
  target: T,
  key: LookupKey<T>,
  ...args: any[]
) {
  return target[key](tryToGetRaw(args[0]), ...args.slice(1));
}

export default lookupArrayHandler;

import MutationArrayMethods from "../../../constants/mutationMethods/array";
import MutationTypedArrayMethods from "../../../constants/mutationMethods/typedArray";
import Keys from "../../../constants/keys";
import iterationHandler from "../iterationHandler";
import producerArrayHandler from "./producerHandler";
import { getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";

type MutationKey<T> = T extends any[] ?
  typeof MutationArrayMethods[number] :
  typeof MutationTypedArrayMethods[number];

function mutationArrayHandler<T extends any[] | TypedArray>(
  proxy: any,
  target: T,
  key: MutationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = args.map(each => getRawTry(each));
  let result: any;
  if (Array.isArray(target)) {
    if (key === Keys.Sort) {
      result = iterationHandler(target as any[], key, cache, onChange, ...rawArgs);
    } else if (key === Keys.Splice) {
      result = producerArrayHandler(target as any[], key, cache, onChange, ...rawArgs);
    }
  } else {
    result = (target as any)[key].apply(target, rawArgs);
  }
  onChange({
    target: proxy,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });
  return result === target ? proxy : result;
}

export default mutationArrayHandler;

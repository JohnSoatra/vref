import MutationArrayMethods from "../../../constants/mutationMethods/array";
import MutationTypedArrayMethods from "../../../constants/mutationMethods/typedArray";
import Keys from "../../../constants/keys";
import { createCallbackArgs, createProxyTry, toProxiedItems, toRawArgs } from "../../utils";
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
  let result: any;
  let assigned: boolean | undefined;
  if (Array.isArray(target)) {
    if (key === Keys.Sort) {
      const [compareFn] = createCallbackArgs(cache, onChange, args[0]);
      result = target.sort(compareFn);
      assigned = true;
    } else if (key === Keys.Splice) {
      const [start, deleteCount, ...items] = toRawArgs(args);
      const newArray = target.splice(start, deleteCount, ...items);
      result = toProxiedItems(newArray, cache, onChange);
      assigned = true;
    } else if (key === Keys.Pop || key === Keys.Shift) {
      const deletedItem = (target as any)[key]();
      result = createProxyTry(deletedItem, cache, onChange, false);
      assigned = true;
    }
  }
  if (!assigned) {
    const rawArgs = toRawArgs(args);
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

import IterationArrayMethods from "../../constants/iterationMethods/array";
import IterationMapMethods from "../../constants/iterationMethods/map";
import IterationSetMethods from "../../constants/iterationMethods/set";
import { createProxyTry } from "../utils";
import { TypedArray } from "../../types/types";
import { CacheProxy, CacheShallow } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  typeof IterationArrayMethods[number] :
  T extends Map<any, any> ?
  typeof IterationMapMethods[number] :
  typeof IterationSetMethods[number];

export default function iterationHandler<T extends any[] | TypedArray | Map<any, any> | Set<any>>(
  target: T,
  key: IterationKey<T>,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [callbackFn, ...restArgs] = args;
  function callback(this: any, ...callbackArgs: any[]) {
    const proxiedArgs = callbackArgs.map(arg => createProxyTry(arg, cacheProxy, cacheShallow, onChange));
    return callbackFn.apply(this, proxiedArgs);
  }
  return (target as any)[key](callback, ...restArgs);
}

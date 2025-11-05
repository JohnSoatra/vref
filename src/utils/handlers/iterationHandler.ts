import IterationArrayMethods from "../../constants/iterationMethods/array";
import IterationMapMethods from "../../constants/iterationMethods/map";
import IterationSetMethods from "../../constants/iterationMethods/set";
import IterationTypedArrayMethods from "../../constants/iterationMethods/typeArray";
import { tryToCreateProxy } from "../utils";
import { TypedArray } from "../../types/types";
import { CacheProxy, CacheShallow } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  typeof IterationArrayMethods[number] :
  T extends TypedArray ?
  typeof IterationTypedArrayMethods[number] :
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
  function callback(this: any, ..._args: any[]) {
    const proxiedArgs = _args.map(arg => tryToCreateProxy(arg, cacheProxy, cacheShallow, onChange));
    return args[0].apply(this, proxiedArgs);
  }
  return (target as any)[key](callback, ...args);
}

import { IterationArrayMethods } from "../../constants/iterationMethods/array";
import { IterationMapMethods } from "../../constants/iterationMethods/map";
import { IterationSetMethods } from "../../constants/iterationMethods/set";
import { createCallbackArgs, isReduceKey, reduceCallbackArgs } from "../utils";
import { CacheParentsProxy, CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  IterationArrayMethods :
  T extends Map<any, any> ?
  IterationMapMethods :
  IterationSetMethods;

/**
 * Handles iteration methods like `forEach`, `map`, `filter`, `some`, `every`, etc.
 * for Arrays, Maps, and Sets — ensuring their callbacks receive
 * proxied (reactive) elements.
 *
 * Behavior:
 * - Wraps the callback function so any values passed to it are automatically proxied.
 * - Calls the native iteration method with the wrapped callback and remaining args.
 * - Works with arrays, typed arrays, Maps, and Sets.
 */
export default function iterationHandler<T extends any[] | Map<any, any> | Set<any>>(
  //expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  key: IterationKey<T>,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  let callbackArgs: any[];
  if (proxy) {
    callbackArgs = isReduceKey(key) ?
      reduceCallbackArgs(
        this as any[],
        proxy,
        cache,
        cacheParents,
        onChange,
        ...args
      ) :
      createCallbackArgs(
        this,
        proxy,
        cache,
        cacheParents,
        onChange,
        ...args
      );
  } else {
    callbackArgs = args;
  }
  return (target as any)[key].apply(this, callbackArgs);
}

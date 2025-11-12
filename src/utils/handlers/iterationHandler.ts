import { createCallbackArgs } from "../utils";
import { IterationArrayMethods } from "../../constants/iterationMethods/array";
import { IterationMapMethods } from "../../constants/iterationMethods/map";
import { IterationSetMethods } from "../../constants/iterationMethods/set";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  IterationArrayMethods :
  T extends Map<any, any> ?
  IterationMapMethods :
  IterationSetMethods;

/**
 * Handles iteration methods like `forEach`, `map`, `filter`, `some`, `every`, etc.
 * for Arrays, TypedArrays, Maps, and Sets — ensuring their callbacks receive
 * proxied (reactive) elements.
 *
 * Behavior:
 * - Wraps the callback function so any values passed to it are automatically proxied.
 * - Calls the native iteration method with the wrapped callback and remaining args.
 * - Works with arrays, typed arrays, Maps, and Sets.
 */
export default function iterationHandler<T extends any[] | TypedArray | Map<any, any> | Set<any>>(
  this: any,
  target: T,
  key: IterationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const callbackArgs = createCallbackArgs(cache, onChange, ...args);
  return (target as any)[key].apply(this, callbackArgs);
}

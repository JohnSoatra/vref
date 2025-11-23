import { PickingArrayMethods } from "../../../constants/pickingMethods/array";
import { createProxyTry, toRawArgs } from "../../utils";
import { CacheParentsProxy, CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "picking" methods on arrays, currently only `at`.
 *
 * Behavior:
 * - Converts proxied arguments to raw values before calling the native method.
 * - Wraps the returned value in a proxy if it's a creatable object.
 * - Returns `undefined` or the proxied result.
 */
export default function pickingArrayHandler<T extends any[]>(
  // expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParent: CacheParentsProxy,
  key: PickingArrayMethods,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  const rawArgs = proxy ? toRawArgs(args) : args;
  const value = (target as any)[key].apply(this, rawArgs);
  return proxy ? createProxyTry(
    value,
    proxy,
    cache,
    cacheParent,
    onChange
  ) : value;
}

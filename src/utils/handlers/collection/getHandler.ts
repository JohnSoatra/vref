import { createProxyTry, getRawTry } from "../../utils";
import { CacheParentsProxy, CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles getting a value from a Map or WeakMap.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to correctly access the Map/WeakMap.
 * - If the retrieved value is creatable (object/array), wraps it in a proxy to maintain reactivity.
 * - Does not modify the original collection.
 */
export default function getHandler<T extends Map<any, any> | WeakMap<any, any>>(
  // expects raw object,
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParent: CacheParentsProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  const [key] = args;
  const rawKey = proxy ? getRawTry(key) : key;
  const value = target.get.call(this, rawKey);
  return proxy ? createProxyTry(
    value,
    proxy,
    cache,
    cacheParent,
    onChange
  ) : value;
}

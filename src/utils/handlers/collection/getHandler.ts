import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles getting a value from a Map or WeakMap.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to correctly access the Map/WeakMap.
 * - If the retrieved value is creatable (object/array), wraps it in a proxy to maintain reactivity.
 * - Does not modify the original collection.
 */
export default function getHandler(
  this: any,
  target: Map<any, any> | WeakMap<any, any>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [key] = args;
  const rawKey = getRawTry(key);
  const value = target.get.call(this, rawKey);
  return createProxyTry(value, cache, onChange);
}

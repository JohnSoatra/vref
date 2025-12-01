import { getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";

/**
 * Checks whether a key exists in a Map, Set, WeakMap, or WeakSet.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to ensure proper lookup.
 * - Works with all supported collections: Map, Set, WeakMap, WeakSet.
 * - Returns a boolean indicating presence.
 */
export default function hasHandler<T extends
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
>(
  // expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  ...args: any[]
) {
  const isProxied = cache.has(this);
  const [key] = args;
  const rawKey = isProxied ? getRawTry(key) : key;
  return target.has.call(this, rawKey);
}

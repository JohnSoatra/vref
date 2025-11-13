import { getWeakValue, getRawTry, removeCacheTry, isMapCollection, hasFlag } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles deleting a key/value from Map, Set, WeakMap, or WeakSet.
 *
 * Behavior:
 * - Converts proxied keys to their raw versions to maintain correct identity.
 * - For Map/WeakMap, also retrieves the previous value via `getWeakValue`.
 * - Removes any cached proxies for the deleted key and, if applicable, the value.
 * - Triggers `onChange` only if deletion actually occurs.
 */
export default function deleteHandler(
  this: any, //expects raw object
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [key] = args;
  const rawKey = getRawTry(key);
  const prevValue = getWeakValue(target, rawKey);
  const deleted = target.delete.call(this, rawKey);
  if (deleted) {
    removeCacheTry(rawKey, cache);
    isMapCollection(target) && removeCacheTry(prevValue, cache);
    cache.has(this) && onChange({
      target: this,
      action: 'delete',
      key,
      value: undefined,
      prevValue
    });
  }
  return deleted;
}

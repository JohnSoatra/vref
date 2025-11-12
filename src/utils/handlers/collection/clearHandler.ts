import { hasFlag, isMapCollection, removeCacheTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Removes cached proxies for a Map or Set and its entries/values.
 *
 * - For Map, removes both keys and values from the cache.
 * - For Set, removes each value from the cache.
 */
function clearFromCache(target: Map<any, any> | Set<any>, cache: CacheProxy) {
  removeCacheTry(target, cache);
  if (isMapCollection(target)) {
    for (const [key, value] of target) {
      removeCacheTry(key, cache);
      removeCacheTry(value, cache);
    }
  } else {
    for (const value of target) {
      removeCacheTry(value, cache);
    }
  }
}

/**
 * Handles the `clear()` method for reactive Map/Set.
 *
 * - Clears the collection.
 * - Removes all entries from the proxy cache.
 * - Triggers the `onChange` callback if the collection was non-empty.
 */
export default function clearHandler(
  this: any,
  target: Map<any, any> | Set<any>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  if (target.size > 0) {
    target.clear.call(this);
    clearFromCache(target, cache);
    hasFlag(this, 'is_proxy') && onChange({
      target: this,
      action: 'clear',
      key: undefined,
      value: undefined,
      prevValue: undefined,
    });
  }
}

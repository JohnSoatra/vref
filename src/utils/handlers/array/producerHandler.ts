import { ProducerArrayMethods } from "../../../constants/producerMethods/array";
import { toProxiedItems, toRawArgs } from "../../utils";
import { CacheParentsProxy, CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "producer" methods on arrays, such as `concat`, `slice`, `flat`, etc.
 *
 * Behavior:
 * - Converts proxied arguments to raw values to prevent double-proxy issues.
 * - Wraps returned arrays/items in proxies for reactive tracking.
 * - Original array is **not mutated** for immutable producer methods.
 */
export default function producerArrayHandler<T extends any[]>(
  // expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParent: CacheParentsProxy,
  key: ProducerArrayMethods,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  const rawArgs = proxy ? toRawArgs(args) : args;
  const value = target[key].apply(this, rawArgs);
  return proxy ? toProxiedItems(
    value,
    proxy,
    cache,
    cacheParent,
    onChange
  ) : value;
}

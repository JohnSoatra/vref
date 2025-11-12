import { getRawTry } from "../../utils";

/**
 * Checks whether a key exists in a Map, Set, WeakMap, or WeakSet.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to ensure proper lookup.
 * - Works with all supported collections: Map, Set, WeakMap, WeakSet.
 * - Returns a boolean indicating presence.
 */
export default function hasHandler(
  this: any,
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  ...args: any[]
) {
  const [key] = args;
  const rawKey = getRawTry(key);
  return target.has.call(this, rawKey);
}

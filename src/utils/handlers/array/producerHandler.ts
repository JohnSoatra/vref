import { toProxiedItems, toRawArgs } from "../../utils";
import { ProducerArrayMethods } from "../../../constants/producerMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "producer" methods on arrays, such as `concat`, `slice`, `flat`,
 * `splice`, and newer immutable methods like `toSorted`, `toReversed`, `toSpliced`, `with`.
 *
 * Behavior:
 * - Converts proxied arguments to raw values to prevent double-proxy issues.
 * - Wraps returned arrays/items in proxies for reactive tracking.
 * - Original array is **not mutated** for immutable producer methods.
 * - `splice` still mutates the original array but the returned removed items are proxied.
 */
export default function producerArrayHandler(
  this: any,
  target: any[],
  key: ProducerArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  const value = target[key].apply(this, rawArgs);
  return toProxiedItems(value, cache, onChange);
}

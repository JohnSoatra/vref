import { getRawTry, hasFlag, isProxy } from "../../utils";
import { OnChangeHandler } from "../../../types/ref";
import { CacheProxy } from "../../../types/createProxy";

/**
 * Handles adding a value to a Set or WeakSet.
 *
 * Behavior:
 * - Converts proxied values to raw objects to avoid double-proxy issues.
 * - Only triggers `onChange` if the value was not already present in the Set/WeakSet.
 * - Returns the proxy itself for fluent use.
 */
export default function addHandler(
  this: any, //expects raw object
  target: Set<any> | WeakSet<any>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [value] = args;
  const rawValue = getRawTry(value);
  const hasValue = target.has.call(this, rawValue);
  if (!hasValue) {
    target.add.call(this, rawValue);
    cache.has(this) && onChange({
      target: this,
      action: 'add',
      key: value,
      value,
      prevValue: undefined,
    });
  }
  return this;
}

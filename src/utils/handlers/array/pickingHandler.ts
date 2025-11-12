import { createProxyTry, toRawArgs } from "../../utils";
import { PickingArrayMethods } from "../../../constants/pickingMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "picking" methods on arrays, currently only `at`.
 *
 * Behavior:
 * - Converts proxied arguments to raw values before calling the native method.
 * - Wraps the returned value in a proxy if it's a creatable object.
 * - Returns `undefined` or the proxied result.
 */
function pickingArrayHandler(
  this: any,
  target: any[],
  key: PickingArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  const value = (target as any)[key].apply(this, rawArgs);
  return createProxyTry(value, cache, onChange);
}

export default pickingArrayHandler;

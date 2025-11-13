import { addFlag, hasFlag, removeFlag, toRawArgs } from "../../utils";
import { MutationArrayMethods } from "../../../constants/mutationMethods/array";
import { MutationTypedArrayMethods } from "../../../constants/mutationMethods/typedArray";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";
import { CacheProxy } from "../../../types/createProxy";

type MutationKey<T> = T extends any[] ?
  MutationArrayMethods :
  MutationTypedArrayMethods;

/**
 * Handles mutation methods on arrays or typed arrays.
 *
 * Supports `push`, `pop`, `shift`, `splice`, `sort`, `fill`, `copyWithin`, etc.
 * - Converts proxied arguments to raw values.
 * - Triggers `onChange` after mutation.
 */
export default function mutationArrayHandler<T extends any[] | TypedArray>(
  this: any,
  target: T,
  key: MutationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  addFlag(this, 'batch');
  const value = (target as any)[key].apply(this, rawArgs);
  removeFlag(this, 'batch');
  cache.has(this) && onChange({
    target: this,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });
  return value;
}

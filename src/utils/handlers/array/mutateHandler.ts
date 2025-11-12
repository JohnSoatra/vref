import { addFlag, hasFlag, removeFlag, toRawArgs } from "../../utils";
import { MutationArrayMethods } from "../../../constants/mutationMethods/array";
import { MutationTypedArrayMethods } from "../../../constants/mutationMethods/typedArray";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";

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
function mutationArrayHandler<T extends any[] | TypedArray>(
  this: any,
  target: T,
  key: MutationKey<T>,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  addFlag(this, 'batch');
  const value = (target as any)[key].apply(this, rawArgs);
  removeFlag(this, 'batch');
  hasFlag(this, 'is_proxy') && onChange({
    target: this,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });
  return value;
}

export default mutationArrayHandler;

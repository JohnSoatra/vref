import { MutationArrayMethods } from "../../../constants/mutationMethods/array";
import { MutationTypedArrayMethods } from "../../../constants/mutationMethods/typedArray";
import { toRawArgs } from "../../utils";
import { TypedArray } from "../../../types/types";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

type MutationKey<T> = T extends any[] ?
  MutationArrayMethods :
  MutationTypedArrayMethods;

/**
 * Handles mutation methods on arrays or typed arrays.
 *
 * Supports `copyWithin`, `fill`, `push`, etc.
 * - Converts proxied arguments to raw values.
 * - Triggers `onChange` after mutation.
 */
export default function mutationArrayHandler<T extends any[] | TypedArray>(
  // expect raw object
  this: T,
  target: T,
  cache: CacheProxy,
  key: MutationKey<T>,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  const rawArgs = proxy ? toRawArgs(args) : args;
  const value = (target as any)[key].apply(this, rawArgs);
  proxy && onChange({
    target: proxy,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });
  return (value === this && proxy) ? proxy : value;
}

import MutationArrayMethods from "../../../constants/mutationMethods/array";
import MutationTypedArrayMethods from "../../../constants/mutationMethods/typedArray";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";

type MutationKey<T> = T extends any[] ?
  typeof MutationArrayMethods[number] :
  typeof MutationTypedArrayMethods[number];

function mutationArrayHandler<T extends any[] | TypedArray>(
  proxy: any,
  target: T,
  key: MutationKey<T>,
  onChange: OnChangeHandler,
  ...args: any[]
): any {
  const result = (target as any)[key](...args);

  onChange({
    target: proxy,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });

  return result === target ? proxy : result;
}

export default mutationArrayHandler;

import IterationArrayMethods from "../../constants/iterationMethods/array";
import IterationMapMethods from "../../constants/iterationMethods/map";
import IterationSetMethods from "../../constants/iterationMethods/set";
import { createCallbackArgs } from "../utils";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  typeof IterationArrayMethods[number] :
  T extends Map<any, any> ?
  typeof IterationMapMethods[number] :
  typeof IterationSetMethods[number];

export default function iterationHandler<T extends any[] | TypedArray | Map<any, any> | Set<any>>(
  target: T,
  key: IterationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [callbackFn, ...restArgs] = createCallbackArgs(cache, onChange, ...args);
  return (target as any)[key](callbackFn, ...restArgs);
}

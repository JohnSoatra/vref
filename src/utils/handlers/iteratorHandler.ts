import IteratorMethods from "../../constants/iteratorMethods";
import { createProxyTry } from "../utils";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

export default function iteratorHandler(
  target: any[] | TypedArray | Map<any, any> | Set<any>,
  key: typeof IteratorMethods[number],
  cache: CacheProxy,
  onChange: OnChangeHandler,
): Iterator<any> & Iterable<any> {
  const iterator = target[key]() as Iterator<any>;
  return {
    next(value?: any) {
      const result = iterator.next(value);
      if (!result.done) {
        result.value = createProxyTry(result.value, cache, onChange);
      }
      return result;
    },
    [Symbol.iterator]() {
      return this;
    }
  };
}

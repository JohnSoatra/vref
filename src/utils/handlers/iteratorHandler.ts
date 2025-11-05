import IteratorMethods from "../../constants/iteratorMethods";
import { tryToCreateProxy } from "../utils";
import { TypedArray } from "../../types/types";
import { CacheProxy, CacheShallow } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

export default function iteratorHandler(
  target: any[] | TypedArray | Map<any, any> | Set<any>,
  key: typeof IteratorMethods[0],
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
): Iterator<any> & Iterable<any> {
  const iterator = target[key]() as Iterator<any>;

  return {
    next(value?: any) {
      const result = iterator.next(value);
      if (!result.done) {
        result.value = tryToCreateProxy(result.value, cacheProxy, cacheShallow, onChange);
      }
      return result;
    },
    [Symbol.iterator]() {
      return this;
    }
  };
}

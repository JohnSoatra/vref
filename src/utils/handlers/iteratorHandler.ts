import { IteratorMethods } from "../../constants/iteratorMethods";
import { createProxyTry, getRawTry, isMapCollection } from "../utils";
import { CacheParentsProxy, CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

export function createProxiedIterator<T extends any[] | Map<any, any> | Set<any>>(
  iterator: Iterator<any>,
  target: T,
  parent: object | undefined,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  key: IteratorMethods,
  onChange: OnChangeHandler,
): Iterator<any> & Iterable<any> {
  const isTargetArray = Array.isArray(target);
  const isResultArray = key === 'entries' || (
    isMapCollection(target) && key === Symbol.iterator
  );
  const proxiedIterator = {
    next(this: any, value?: any) {
      const matchedIterator = this === proxiedIterator ? iterator : this;
      const rawIterator = getRawTry(matchedIterator);
      const result = iterator.next.call(rawIterator, value);
      if (!result.done) {
        if (isResultArray) {
          if (isTargetArray) {
            const [, item] = result.value;
            result.value[1] = createProxyTry(
              item,
              parent,
              cache,
              cacheParents,
              onChange,
              false,
            );
          } else {
            result.value = result.value.map((each: any) => createProxyTry(
              each,
              parent,
              cache,
              cacheParents,
              onChange,
              false,
            ));
          }
        } else {
          result.value = createProxyTry(
            result.value,
            parent,
            cache,
            cacheParents,
            onChange,
            false,
          );
        }
      }
      return result;
    },
    [Symbol.iterator](this: any) {
      return getRawTry(this);
    }
  }
  return proxiedIterator;
}

/**
 * Wraps an iterator (from Array, Map, or Set) in a proxied version
 * so that values yielded during iteration remain reactive.
 *
 * Behavior:
 * - Calls the native iterator method (`Symbol.iterator`, `entries`, `values`, `keys`) on the target.
 * - Wraps each yielded value with `createProxyTry` so consumers get reactive objects.
 * - Preserves the iterable protocol (`[Symbol.iterator]()`) for `for..of` or spread operations.
 */
export default function iteratorHandler<T extends any[] | Map<any, any> | Set<any>>(
  // expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  key: IteratorMethods,
  onChange: OnChangeHandler,
) {
  const proxy = cache.get(this);
  const iterator = target[key].call(this) as Iterator<any> & Iterable<any>;
  return proxy ? createProxiedIterator(
    iterator,
    this,
    proxy,
    cache,
    cacheParents,
    key,
    onChange
  ) : iterator;
}

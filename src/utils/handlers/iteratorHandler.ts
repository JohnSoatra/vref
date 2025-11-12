import { createProxiedIterator } from "../utils";
import { IteratorMethods } from "../../constants/iteratorMethods";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

/**
 * Wraps an iterator (from Array, TypedArray, Map, or Set) in a proxied version
 * so that values yielded during iteration remain reactive.
 *
 * Behavior:
 * - Calls the native iterator method (`Symbol.iterator`, `entries`, `values`, `keys`) on the target.
 * - Wraps each yielded value with `createProxyTry` so consumers get reactive objects.
 * - Preserves the iterable protocol (`[Symbol.iterator]()`) for `for..of` or spread operations.
 */
export default function iteratorHandler(
  this: any,
  target: any[] | TypedArray | Map<any, any> | Set<any>,
  key: IteratorMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
): Iterator<any> & Iterable<any> {
  const iterator = target[key].call(this) as Iterator<any>;
  return createProxiedIterator(iterator, cache, onChange);
}

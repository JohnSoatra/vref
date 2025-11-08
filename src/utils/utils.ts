import createProxy from "./createProxy";
import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import IterationArrayMethods from "../constants/iterationMethods/array";
import IterationMapMethods from "../constants/iterationMethods/map";
import IterationSetMethods from "../constants/iterationMethods/set";
import IteratorMethods from "../constants/iteratorMethods";
import LookupArrayMethods from "../constants/lookupMethods/array";
import MutationArrayMethods from "../constants/mutationMethods/array";
import MutationTypedArrayMethods from "../constants/mutationMethods/typedArray";
import ProducerArrayMethods from "../constants/producerMethods/array";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler, RefOptions } from "../types/ref";
import PickingArrayMethods from "../constants/pickingMethods/array";

export function isForbiddenKey(key: any) {
  return Keys.ForbiddenKeys.includes(key);
}

export function isCreatable(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isTypedArray(value: any) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || isTypedArray(value);
}

export function isProxy(value: object): boolean {
  return (value as any)[Symbols.IsProxy] ?? false;
}

export function isMapCollection(target: object) {
  return target instanceof Map || target instanceof WeakMap;
}

export function isSetCollection(target: object) {
  return target instanceof Set || target instanceof WeakSet;
}

export function isCollection(target: object) {
  return isMapCollection(target) || isSetCollection(target);
}

export function isIterationMethod(target: object, key: any) {
  return (
    (Array.isArray(target) && IterationArrayMethods.includes(key)) ||
    (target instanceof Map && IterationMapMethods.includes(key)) ||
    (target instanceof Set && IterationSetMethods.includes(key))
  );
}

export function isIteratorMethod(target: object, key: any) {
  return (
    (Array.isArray(target) || target instanceof Map || target instanceof Set) &&
    IteratorMethods.includes(key)
  );
}

export function isLookupMethod(target: object, key: any) {
  return Array.isArray(target) && LookupArrayMethods.includes(key);
}

export function isMutationMethod(target: object, key: any) {
  return (
    (Array.isArray(target) && MutationArrayMethods.includes(key)) ||
    (isTypedArray(target) && MutationTypedArrayMethods.includes(key))
  );
}

export function isPickingMethod(target: object, key: any) {
  return Array.isArray(target) && PickingArrayMethods.includes(key);
}

export function isProducerMethod(target: object, key: any) {
  return Array.isArray(target) && ProducerArrayMethods.includes(key);
}

export function getRaw(proxy: object): object | undefined {
  return (proxy as any)[Symbols.RawObject];
}

export function getWeakValue(target: WeakMap<any, any> | WeakSet<any>, key: any) {
  if (target instanceof WeakMap) {
    return target.get(key);
  } else if (target.has(key)) {
    return key;
  }
  return undefined;
}

export function nextFrame(callback: () => void) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setImmediate(callback);
  }
}

export function getNow() {
  if (typeof performance !== 'undefined') {
    return performance.now();
  }
  return Date.now();
}

export function getRawTry(value: any) {
  if (isCreatable(value) && isProxy(value)) {
    return getRaw(value);
  }
  return value;
}

export function createProxyTry(...args: Parameters<typeof createProxy>) {
  const value = args[0];
  if (isCreatable(value)) {
    return createProxy(...args);
  }
  return value;
}

export function createOptions(onchangeOrOptions: OnChangeHandler | RefOptions | undefined) {
  let options: RefOptions = {}
  if (onchangeOrOptions) {
    if (typeof onchangeOrOptions === 'function') {
      options.onchange = onchangeOrOptions;
    } else {
      options = onchangeOrOptions;
    }
  }
  return options;
}

export function removeCacheTry(value: any, cache: CacheProxy) {
  if (isCreatable(value)) {
    cache.delete(value);
  }
}

export function toRawArgs(args: any[]) {
  return args.map(each => getRawTry(each));
}

export function toProxiedItems(array: any[], cache: CacheProxy, onChange: OnChangeHandler) {
  return array.map(each => createProxyTry(each, cache, onChange, false));
}

export function createCallbackArgs(cache: CacheProxy, onChange: OnChangeHandler, ...args: any[]) {
  const [callbackFn, ...restArgs] = args;
  function callback(this: any, ...callbackArgs: any[]) {
    const proxiedArgs = callbackArgs.map(arg => createProxyTry(arg, cache, onChange));
    return callbackFn.apply(this, proxiedArgs);
  }
  return [callback, ...restArgs];
}

export function createProxiedIterator(iterator: Iterator<any>, cache: CacheProxy, onChange: OnChangeHandler) {
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
  }
}

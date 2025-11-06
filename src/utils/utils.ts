import createProxy from "./createProxy";
import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import IterationArrayMethods from "../constants/iterationMethods/array";
import IterationTypedArrayMethods from "../constants/iterationMethods/typeArray";
import IterationMapMethods from "../constants/iterationMethods/map";
import IterationSetMethods from "../constants/iterationMethods/set";
import IteratorMethods from "../constants/iteratorMethods";
import LookupArrayMethods from "../constants/lookupMethods/array";
import LookupTypedArrayMethods from "../constants/lookupMethods/typedArray";
import MutationArrayMethods from "../constants/mutationMethods/array";
import MutationTypedArrayMethods from "../constants/mutationMethods/typedArray";
import { OnChangeHandler, RefOptions } from "../types/ref";

export function isForbiddenKey(key: any) {
  return Keys.ForbiddenKeys.includes(key);
}

export function isCreatable(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

export function isTypedArray(value: any) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
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
    (isTypedArray(target) && IterationTypedArrayMethods.includes(key)) ||
    (target instanceof Map && IterationMapMethods.includes(key)) ||
    (target instanceof Set && IterationSetMethods.includes(key))
  );
}

export function isIteratorMethod(target: object, key: any) {
  return (
    (isArray(target) || target instanceof Map || target instanceof Set) &&
    IteratorMethods.includes(key)
  );
}

export function isLookupMethod(target: object, key: any) {
  return (
    (Array.isArray(target) && LookupArrayMethods.includes(key)) ||
    (isTypedArray(target) && LookupTypedArrayMethods.includes(key))
  );
}

export function isMutationMethod(target: object, key: any) {
  return (
    (Array.isArray(target) && MutationArrayMethods.includes(key)) ||
    (isTypedArray(target) && MutationTypedArrayMethods.includes(key))
  );
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

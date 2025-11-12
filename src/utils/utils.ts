import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import Flags, { Flags as FlagKey } from "../constants/flags";
import createProxy from "./createProxy";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

export function isForbiddenKey(key: any) {
  return Keys.ForbiddenKeys.has(key);
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

export function isStrongCollection(target: object) {
  return target instanceof Map || target instanceof Set;
}

export function isCollection(target: object) {
  return isMapCollection(target) || isSetCollection(target);
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

export function getRawTry(value: any) {
  if (isCreatable(value) && isProxy(value)) {
    return getRaw(value);
  }
  return value;
}

export function createProxyTry(...args: Parameters<typeof createProxy>) {
  const [value] = args;
  if (isCreatable(value)) {
    return createProxy(...args);
  }
  return value;
}

export function removeCacheTry(value: any, cache: CacheProxy) {
  if (isCreatable(value)) {
    return cache.delete(value);
  }
  return false;
}

export function toRawArgs(args: any[]) {
  return args.map(each => getRawTry(each));
}

export function toProxiedItems(array: any[], cache: CacheProxy, onChange: OnChangeHandler) {
  return array.map(each => createProxyTry(each, cache, onChange, false));
}

/**
 * Wraps callback functions passed to array/map/set iteration methods
 * to ensure reactive proxy values are passed to the original callback.
 */
export function createCallbackArgs(cache: CacheProxy, onChange: OnChangeHandler, ...args: any[]) {
  if (args.length > 0) {
    const [callbackFn, ...restArgs] = args;
    if (typeof callbackFn === 'function') {
      function callback(this: any, ...callbackArgs: any[]) {
        const proxiedArgs = callbackArgs.map(arg => createProxyTry(arg, cache, onChange));
        return callbackFn.apply(this, proxiedArgs);
      }
      return [callback, ...restArgs];
    }
  }
  return args;
}

export function createProxiedIterator(iterator: Iterator<any>, cache: CacheProxy, onChange: OnChangeHandler) {
  return {
    next(this: any, value?: any) {
      const result = iterator.next.call(this, value);
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

export function hasFlag(value: any, flag: FlagKey): boolean {
  if (isCreatable(value) && isProxy(value)) {
    return value[Flags.get(flag)!] ?? false;
  }
  return false;
}

export function addFlag(value: any, flag: FlagKey) {
  if (isCreatable(value) && isProxy(value)) {
    value[Flags.get(flag)!] = true;
  }
}

export function removeFlag(value: any, flag: FlagKey) {
  if (isCreatable(value) && isProxy(value)) {
    delete value[Flags.get(flag)!];
  }
}

export function isPlainObject(value: any): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || !!value.constructor;
}

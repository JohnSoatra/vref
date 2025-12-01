import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import createProxy from "./createProxy";
import { CacheParentsProxy, CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

export function isForbiddenKey(key: any) {
  return Keys.ForbiddenKeys.has(key);
}

export function isReduceKey(key: any) {
  return Keys.ReduceKeys.has(key);
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isTypedArray(value: any) {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || isTypedArray(value);
}

export function isProxiable(value: any) {
  return isObject(value) || isArray(value);
}

export function isProxy(value: object): boolean {
  return (value as any)[Symbols.IsProxy] ?? false;
}

/**
 * Safely checks whether a value is a reactive proxy.
 *
 * - Returns `true` only if:
 *    1. The value is proxiable (object, array, etc.),
 *    2. And it is actually a proxy created by the reactive system.
 *
 * @param value Any value to test.
 * @returns `true` if the value is a valid reactive proxy, otherwise `false`.
 */
export function isProxyTry(value: any) {
  return isProxiable(value) && isProxy(value);
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

export function getRaw(proxy: object): object {
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

/**
 * Safely retrieves the raw (unproxied) value.
 *
 * - If `value` is a proxy created by the reactive system, it returns its original raw target.
 * - If `value` is not a proxy, it simply returns the input as-is.
 * 
 * @param value Any value that may or may not be a proxy.
 * @returns The raw underlying value if proxied, otherwise the original value.
 */
export function getRawTry(value: any) {
  if (isProxyTry(value)) {
    return getRaw(value);
  }
  return value;
}

export function createProxyTry<T extends object>(
  ...args: Parameters<typeof createProxy<T>>
) {
  const [value] = args;
  if (isProxiable(value)) {
    return createProxy(...args);
  }
  return value;
}

export function toRawArgs(args: any[]) {
  return args.map(each => getRawTry(each));
}

export function toProxiedItems(
  array: any[],
  parent: object | undefined,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  onChange: OnChangeHandler
) {
  return array.map(each => createProxyTry(
    each,
    parent,
    cache,
    cacheParents,
    onChange,
    false
  ));
}

/**
 * Wraps callback functions passed to array/map/set iteration methods
 * to ensure reactive proxy values are passed to the original callback.
 */
export function createCallbackArgs<T extends any[] | Map<any ,any> | Set<any>>(
  target: T,
  parent: object | undefined,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [callbackFn, ...restArgs] = args;
  if (typeof callbackFn === 'function') {
    function callback(this: any, ...callbackArgs: any[]) {
      const proxiedArgs = callbackArgs.map(arg => {
        const directParent = target === arg ? undefined : parent;
        return createProxyTry(
          arg,
          directParent,
          cache,
          cacheParents,
          onChange,
          false,
        );
      });
      return callbackFn.apply(this, proxiedArgs);
    }
    return [callback, ...restArgs];
  }
  return args;
}

export function reduceCallbackArgs(
  target: any[],
  parent: object | undefined,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [callbackFn, ...restArgs] = args;
  function callback(this: any, ...callbackArgs: any[]) {
    const proxiedArgs = callbackArgs.map((arg, index) => {
      const directParent = target === arg ? undefined : parent;
      return index > 0 ? createProxyTry(
        arg,
        directParent,
        cache,
        cacheParents,
        onChange,
        false,
      ) : arg
    });
    return callbackFn.apply(this, proxiedArgs);
  }
  return [callback, ...restArgs];
}

export function checkCache(value: any, cache: CacheProxy) {
  if (isProxyTry(value)) {
    cache.set(getRaw(value), value);
  }
}

export function isPlainObject(value: any): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || !!value.constructor;
}

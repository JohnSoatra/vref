import { ConflictArrayMethods } from "../../../constants/conflictMethods/array";
import { createCallbackArgs, createProxyTry, toProxiedItems, toRawArgs } from "../../utils";
import { CacheParentsProxy, CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles array methods that have multiple behaviors (iteration, mutation, picking, or producing arrays)
 * in reactive proxied arrays. These "conflict methods" include:
 * 
 * - filter, toSorted  : iteration + producer → return new proxied array
 * - find, findLast    : iteration + picking  → return single proxied item
 * - sort              : iteration + mutation → mutates in place, triggers onChange
 * - pop, shift        : mutation + picking  → remove item, return as proxied value
 * - splice            : mutation + producer → remove/replace items, return removed items as proxied array
 * 
 * This handler ensures that the returned values maintain reactivity and properly trigger the
 * onChange callback when mutations occur.
 */
export default function conflictArrayHandler<T extends any[]>(
  // expects raw object
  this: T,
  target: T,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  key: ConflictArrayMethods,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const proxy = cache.get(this);
  let value: any;
  switch (key) {
    // iteration methods
    case "filter":
    case "find":
    case "findLast":
    case "sort":
    case "toSorted":
      const callbackArgs = proxy ? createCallbackArgs(
        cache,
        cacheParents,
        onChange,
        ...args
      ) : args;
      value = (target as any)[key].apply(this, callbackArgs);
      switch (key) {
        // producer methods
        case "filter":
        case "toSorted":
          return proxy ? toProxiedItems(
            value,
            proxy,
            cache,
            cacheParents,
            onChange
          ) : value;
        // picking methods
        case "find":
        case "findLast":
          return proxy ? createProxyTry(
            value,
            proxy,
            cache,
            cacheParents,
            onChange
          ) : value;
        // mutation methods
        case "sort":
          proxy && onChange({
            target: proxy,
            action: 'sort',
            key: undefined,
            value: args,
            prevValue: undefined
          });
          return proxy ?? this;
      }
    // mutation methods
    case "pop":
    case "shift":
    case "splice":
      const rawArgs = proxy ? toRawArgs(args) : args;
      value = (target as any)[key].apply(this, rawArgs);
      proxy && onChange({
        target: proxy,
        action: key,
        key: undefined,
        value: args,
        prevValue: undefined
      });
      switch (key) {
        // picking methods
        case "pop":
        case "shift":
          return proxy ? createProxyTry(
            value,
            proxy,
            cache,
            cacheParents,
            onChange,
            false
          ) : value;
        // producer methods
        case "splice":
          return proxy ? toProxiedItems(
            value,
            proxy,
            cache,
            cacheParents,
            onChange
          ) : value;
      }
  }
}

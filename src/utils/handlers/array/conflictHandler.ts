import { createCallbackArgs, createProxyTry, removeFlag, toProxiedItems, toRawArgs, addFlag, hasFlag } from "../../utils";
import { ConflictArrayMethods } from "../../../constants/conflictMethods/array";
import { CacheProxy } from "../../../types/createProxy";
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
export default function conflictArrayHandler(
  this: any,
  target: any[],
  key: ConflictArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any;
  switch (key) {
    // iteration methods
    case "filter":
    case "find":
    case "findLast":
    case "sort":
    case "toSorted":
      const callbackArgs = createCallbackArgs(cache, onChange, ...args);
      addFlag(this, 'batch');
      value = (target as any)[key].apply(this, callbackArgs);
      removeFlag(this, 'batch');
      switch (key) {
        // producer methods
        case "filter":
        case "toSorted":
          return toProxiedItems(value, cache, onChange);
        // picking methods
        case "find":
        case "findLast":
          return createProxyTry(value, cache, onChange);
        // mutation methods
        case "sort":
          cache.has(this) && onChange({
            target: this,
            action: 'sort',
            key: undefined,
            value: args,
            prevValue: undefined
          });
          return value;
      }
    // mutation methods
    case "pop":
    case "shift":
    case "splice":
      const rawArgs = toRawArgs(args);
      addFlag(this, 'batch');
      value = (target as any)[key].apply(this, rawArgs);
      removeFlag(this, 'batch');
      cache.has(this) && onChange({
        target: this,
        action: key,
        key: undefined,
        value: args,
        prevValue: undefined
      });
      switch (key) {
        // picking methods
        case "pop":
        case "shift":
          return createProxyTry(value, cache, onChange, false);
        // producer methods
        case "splice":
          return toProxiedItems(value, cache, onChange);
      }
  }
}

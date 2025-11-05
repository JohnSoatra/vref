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
import lookupArrayHandler from "./handlers/array/lookupHandler";
import mutationArrayHandler from "./handlers/array/mutateHandler";
import iterationHandler from "./handlers/iterationHandler";
import iteratorHandler from "./handlers/iteratorHandler";
import addHandler from "./handlers/collection/addHandler";
import deleteHandler from "./handlers/collection/deleteHandler";
import getHandler from "./handlers/collection/getHandler";
import hasHandler from "./handlers/collection/hasHandler";
import setHandler from "./handlers/collection/setHandler";
import defaultHandler from "./handlers/defaultHandler";
import { forbiddenKey, isArray, isProxy, isTypedArray } from "./utils";
import { CacheProxy, CacheShallow } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

export default function createProxy<T extends Record<string, any>>(
  content: T,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
  saveProxy?: boolean,
) {
  if (isProxy(content)) {
    return content;
  }
  if (cacheProxy.has(content)) {
    return cacheProxy.get(content);
  }

  const proxy = new Proxy(content, {
    get(target: any, key: any, receiver) {
      if (forbiddenKey(key)) {
        return undefined;
      }
      if (key === Symbols.IsProxy) {
        return true;
      }
      if (key === Symbols.RawObject) {
        return content;
      }

      let value: any;

      try {
        value = Reflect.get(target, key, receiver);
      } catch {
        value = Reflect.get(target, key);
      }

      if (
        !(value === undefined || value === null) &&
        (
          isArray(value) ||
          typeof value === 'object' ||
          typeof value === 'function'
        )
      ) {
        if (isArray(value) || typeof value === 'object') {
          return createProxy(value, cacheProxy, cacheShallow, onChange);
        }
        if (
          (Array.isArray(target) && LookupArrayMethods.includes(key)) ||
          (isTypedArray(target) && LookupTypedArrayMethods.includes(key))
        ) {
          return function (...args: any[]) {
            return lookupArrayHandler(target, key, ...args);
          }
        }
        if (
          (Array.isArray(target) && MutationArrayMethods.includes(key)) ||
          (isTypedArray(target) && MutationTypedArrayMethods.includes(key))
        ) {
          return function (...args: any[]) {
            return mutationArrayHandler(proxy, target, key, onChange, ...args);
          }
        }
        if ((target instanceof Set || target instanceof WeakSet) && key === Keys.Add) {
          return function (addValue: any) {
            return addHandler(proxy, target, addValue, onChange);
          }
        }
        if (
          target instanceof Map || target instanceof Set ||
          target instanceof WeakMap || target instanceof WeakSet
        ) {
          if (key === Keys.Delete) {
            return function (deleteKey: any) {
              return deleteHandler(proxy, target, deleteKey, onChange);
            }
          }
          if (key === Keys.Has) {
            return function (hasKey: any) {
              return hasHandler(target, hasKey);
            }
          }
        }
        if (target instanceof Map || target instanceof WeakMap) {
          if (key === Keys.Get) {
            return function (getKey: any) {
              return getHandler(target, getKey, cacheProxy, cacheShallow, onChange);
            }
          }
          if (key === Keys.Set) {
            return function (setKey: any, setValue: any) {
              return setHandler(proxy, target, setKey, setValue, onChange);
            }
          }
        }
        if (
          (Array.isArray(target) && IterationArrayMethods.includes(key)) ||
          (isTypedArray(target) && IterationTypedArrayMethods.includes(key)) ||
          (target instanceof Map && IterationMapMethods.includes(key)) ||
          (target instanceof Set && IterationSetMethods.includes(key))
        ) {
          return function (...args: any[]) {
            return iterationHandler(target, key, cacheProxy, cacheShallow, onChange, ...args);
          }
        }
        if (
          (isArray(target) || target instanceof Map || target instanceof Set) &&
          IteratorMethods.includes(key)
        ) {
          return function () {
            return iteratorHandler(target, key, cacheProxy, cacheShallow, onChange);
          }
        }
        return function (...args: any[]) {
          return defaultHandler(proxy, target, key, ...args);
        }
      }
      return value;
    },
    set(target, key, newValue, receiver) {
      if (forbiddenKey(key)) {
        return true;
      }

      const prevValue = target[key];

      if (!Object.is(prevValue, newValue)) {
        const result = Reflect.set(target, key, newValue, receiver);

        onChange({
          target: proxy,
          action: 'set',
          key,
          value: newValue,
          prevValue,
        });

        return result;
      };
      return true;
    },
    deleteProperty(target, key) {
      if (forbiddenKey(key)) {
        return true;
      }

      const hasKey = Object.prototype.hasOwnProperty.call(target, key);

      if (hasKey) {
        const prevValue = target[key];
        const result = Reflect.deleteProperty(target, key);

        onChange({
          target: proxy,
          action: 'delete',
          key,
          value: undefined,
          prevValue
        });

        return result;
      };
      return true;
    }
  });

  if (saveProxy ?? true) {
    cacheProxy.set(content, proxy);
  }

  return proxy;
}

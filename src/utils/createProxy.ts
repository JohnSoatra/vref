import { isArray, isProxy, mutationMethod } from "./utils";
import Symbols from "../constants/symbols";
import Keys from "../constants/keys";
import arrayHandler from "./handlers/arrayHandler";
import mapHandler from "./handlers/mapHandler";
import setHandler from "./handlers/setHandler";
import mutationHandler from "./handlers/mutationHandler";
import getWeakMapHandler from "./handlers/getWeakHandler";
import hasWeakMapHandler from "./handlers/hasWeakHandler";
import deleteWeakMapHandler from "./handlers/deleteWeakHandler";
import defaultHandler from "./handlers/defaultHandler";
import { OnChange } from "../types/ref";
import { CacheProxy, CacheShallow } from "../types/createProxy";

export default function createProxy<T extends Record<string, any>>(
  content: T,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
) {
  if (isProxy(content)) {
    return content;
  } else if (cacheProxy.has(content)) {
    return cacheProxy.get(content);
  }

  const proxy = new Proxy(content, {
    get(target: any, key, receiver) {
      if (key === Symbols.IsProxy) {
        return true;
      } else if (key === Symbols.RawObject) {
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
        if (isArray(value)) {
          return arrayHandler(target, key, value, cacheProxy, cacheShallow, onChange);
        } else if (typeof value === 'object') {
          if (value instanceof Map) {
            return mapHandler(target, key, value, cacheProxy, cacheShallow, onChange);
          }
          if (value instanceof Set) {
            return setHandler(target, key, value, cacheProxy, cacheShallow, onChange);
          }
          return createProxy(value, cacheProxy, cacheShallow, onChange);
        }
        if (typeof key === 'string') {
          if (key === Keys.Get && value instanceof WeakMap) {
            return function (getKey: any) {
              return getWeakMapHandler(target, getKey, cacheProxy, cacheShallow, onChange);
            }
          } else if (
            key === Keys.Has &&
            (value instanceof WeakMap || value instanceof WeakSet)
          ) {
            return function (hasKey: any) {
              return hasWeakMapHandler(target, hasKey, cacheProxy, cacheShallow, onChange);
            }
          } else if (
            key === Keys.Delete &&
            (value instanceof WeakMap || value instanceof WeakSet)
          ) {
            return function (deleteKey: any) {
              return deleteWeakMapHandler(proxy, target, deleteKey, cacheProxy, cacheShallow, onChange);
            }
          } else if (mutationMethod(target, key)) {
            return function (...args: any[]) {
              return mutationHandler(proxy, target, key, cacheProxy, cacheShallow, onChange, ...args);
            }
          }
        }
        return function (...args: any[]) {
          return defaultHandler(proxy, target, key, cacheProxy, cacheShallow, onChange, ...args);
        }
      }
      return value;
    },
    set(target, key, newValue, receiver) {
      const currentValue = target[key];

      if (Object.is(currentValue, newValue)) {
        const prevValue = proxy[key];
        const result = Reflect.set(target, key, newValue, receiver);

        onChange({
          target: proxy,
          action: 'set',
          key,
          value: newValue,
          prevValue: prevValue,
        });

        return result;
      };
      return true;
    },
    deleteProperty(target, key) {
      const hasKey = Object.prototype.hasOwnProperty.call(target, key);

      if (hasKey) {
        const prevValue = proxy[key];
        const result = Reflect.deleteProperty(target, key);

        onChange({
          target: proxy,
          action: 'delete',
          key,
          value: undefined,
          prevValue: prevValue
        });

        return result;
      };
      return true;
    }
  });

  cacheProxy.set(content, proxy);

  return proxy;
}

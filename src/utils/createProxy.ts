import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import packHandlers from "./packHandlers";
import {
  isArray,
  isProxy,
  isMapCollection,
  isSetCollection,
  isCollection,
  isIterationMethod,
  isIteratorMethod,
  isLookupMethod,
  isMutationMethod,
  isForbiddenKey
} from "./utils";
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
    get(target: any, key, receiver) {
      if (key === Symbols.IsProxy) return true;
      if (key === Symbols.RawObject) return content;
      let value: any;
      try { value = Reflect.get(target, key, receiver); }
      catch { value = Reflect.get(target, key); }
      if (
        !(isForbiddenKey(key) || value === undefined || value === null) &&
        (
          isArray(value) ||
          typeof value === 'object' ||
          typeof value === 'function'
        )
      ) {
        if (isArray(value) || typeof value === 'object') return createProxy(value, cacheProxy, cacheShallow, onChange);
        const handlers = packHandlers(proxy, target, key, cacheProxy, cacheShallow, onChange);
        if (isIteratorMethod(target, key)) return handlers.iteratorHandler;
        if (isIterationMethod(target, key)) return handlers.iterationHandler;
        if (isLookupMethod(target, key)) return handlers.lookupArrayHandler;
        if (isMutationMethod(target, key)) return handlers.mutationArrayHandler;
        if (key === Keys.Get && isMapCollection(target)) return handlers.getHandler
        if (key === Keys.Set && isMapCollection(target)) return handlers.setHandler;
        if (key === Keys.Add && isSetCollection(target)) return handlers.addHandler;
        if (key === Keys.Has && isCollection(target)) return handlers.hasHandler;
        if (key === Keys.Delete && isCollection(target)) return handlers.deleteHandler;
        return handlers.defaultHandler;
      }
      return value;
    },
    set(target, key, newValue, receiver) {
      if (isForbiddenKey(key)) return true;
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
      if (isForbiddenKey(key)) return true;
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

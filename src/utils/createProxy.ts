import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import MutationArrayMethods from "../constants/mutationMethods/array";
import ProducerArrayMethods from "../constants/producerMethods/array";
import IterationArrayMethods from "../constants/iterationMethods/array";
import IteratorMethods from "../constants/iteratorMethods";
import LookupArrayMethods from "../constants/lookupMethods/array";
import PickingArrayMethods from "../constants/pickingMethods/array";
import ConflictArrayMethods from "../constants/conflictMethods/array";
import MutationTypedArrayMethods from "../constants/mutationMethods/typedArray";
import IterationMapMethods from "../constants/iterationMethods/map";
import IterationSetMethods from "../constants/iterationMethods/set";
import packHandlers from "./packHandlers";
import {
  isProxy,
  isMapCollection,
  isSetCollection,
  isCollection,
  isForbiddenKey,
  isTypedArray,
  isStrongCollection,
  isProxiable
} from "./utils";
import { CacheParentsProxy, CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

/**
 * Recursively creates a reactive Proxy around an object, array, or collection.
 *
 * Features:
 * - Reuses cached proxies to maintain reference consistency.
 * - Automatically packs specialized handlers for arrays, maps, and sets.
 * - Triggers `onChange` when properties or collections are mutated.
 * - Safely skips forbidden or internal keys (like Symbols.RawObject).
 *
 * @param content Target object or collection to proxy.
 * @param cache WeakMap used to store raw-to-proxy mappings for identity preservation.
 * @param onChange Callback triggered when reactive mutations occur.
 * @param saveProxy Whether to store the proxy in cache (defaults to true).
 * @returns A reactive Proxy wrapping the original content.
 */
export default function createProxy<T extends object>(
  content: T,
  parent: object | undefined,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  onChange: OnChangeHandler,
  saveProxy?: boolean,
) {
  if (isProxy(content)) return content;
  let parents = cacheParents.get(content);
  if (!parents) {
    parents = new Set(parent ? [parent] : []);
    cacheParents.set(content, parents);
  } else if (parent) {
    parents.add(parent);
  }
  const cachedProxy = cache.get(content);
  if (cachedProxy) return cachedProxy;

  let fromSetTrap = false;
  const proxy = new Proxy(content, {
    get(target: any, key: any, receiver) {
      if (key === Symbols.Parents) return parents;
      if (key === Symbols.IsProxy) return true;
      if (key === Symbols.RawObject) return content;
      let value: any;
      try { value = Reflect.get(target, key, receiver); }
      catch { value = Reflect.get(target, key); }
      if (!(isForbiddenKey(key) || value === undefined)) {
        if (isProxiable(value)) {
          return createProxy(
            value,
            proxy,
            cache,
            cacheParents,
            onChange
          );
        } else if (typeof value === 'function') {
          const handlers = packHandlers(target, key, cache, cacheParents, onChange);
          if (Array.isArray(target)) {
            if (ConflictArrayMethods.has(key)) return handlers.conflictArrayHandler;
            if (MutationArrayMethods.has(key)) return handlers.mutationArrayHandler;
            if (ProducerArrayMethods.has(key)) return handlers.producerArrayHandler;
            if (IterationArrayMethods.has(key)) return handlers.iterationHandler;
            if (IteratorMethods.has(key)) return handlers.iteratorHandler;
            if (LookupArrayMethods.has(key)) return handlers.lookupArrayHandler;
            if (PickingArrayMethods.has(key)) return handlers.pickingArrayHandler;
          }
          if (isTypedArray(target) && MutationTypedArrayMethods.has(key)) {
            return handlers.mutationArrayHandler;
          }
          if (isMapCollection(target)) {
            if (key === Keys.Get) return handlers.getHandler;
            if (key === Keys.Set) return handlers.setHandler;
          }
          if (isSetCollection(target) && key === Keys.Add) {
            return handlers.addHandler;
          }
          if (
            (target instanceof Map && IterationMapMethods.has(key)) ||
            (target instanceof Set && IterationSetMethods.has(key))
          ) {
            return handlers.iterationHandler;
          }
          if (isStrongCollection(target)) {
            if (key === Keys.Clear) return handlers.clearHandler;
            if (IteratorMethods.has(key)) return handlers.iteratorHandler;
          }
          if (isCollection(target)) {
            if (key === Keys.Has) return handlers.hasHandler;
            if (key === Keys.Delete) return handlers.deleteHandler;
          }
          return handlers.defaultHandler;
        }
      }
      return value;
    },
    set(target, key, newValue, receiver) {
      if (isForbiddenKey(key)) return true;
      const prevValue = target[key];
      if (!Object.is(prevValue, newValue)) {
        fromSetTrap = true;
        const updated = Reflect.set(target, key, newValue, receiver);
        fromSetTrap = false;
        if (updated) {
          onChange({
            target: proxy,
            action: 'set',
            key,
            value: newValue,
            prevValue,
          });
        }
        return updated;
      };
      return true;
    },
    deleteProperty(target, key) {
      if (isForbiddenKey(key)) return true;
      const hasKey = Object.prototype.hasOwnProperty.call(target, key);
      if (hasKey) {
        const prevValue = target[key];
        const deleted = Reflect.deleteProperty(target, key);
        if (deleted) {
          onChange({
            target: proxy,
            action: 'delete',
            key,
            value: undefined,
            prevValue
          });
        }
        return deleted;
      };
      return true;
    },
    defineProperty(target, key, attributes) {
      if (isForbiddenKey(key)) return true;
      const prevValue = target[key];
      const defined = Reflect.defineProperty(target, key, attributes);
      if (!fromSetTrap && defined) {
        const newValue = attributes.value;
        if (!Object.is(prevValue, newValue)) {
          onChange({
            target: proxy,
            action: 'define',
            key,
            value: newValue,
            prevValue,
          });
        }
      }
      return defined;
    },
    setPrototypeOf() {
      return true;
    },
  });
  if (saveProxy ?? true) {
    cache.set(content, proxy);
  }
  return proxy;
}

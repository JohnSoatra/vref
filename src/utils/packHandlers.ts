import lookupArrayHandler from "./handlers/array/lookupHandler";
import mutationArrayHandler from "./handlers/array/mutateHandler";
import addHandler from "./handlers/collection/addHandler";
import deleteHandler from "./handlers/collection/deleteHandler";
import getHandler from "./handlers/collection/getHandler";
import hasHandler from "./handlers/collection/hasHandler";
import setHandler from "./handlers/collection/setHandler";
import clearHandler from "./handlers/collection/clearHandler";
import defaultHandler from "./handlers/defaultHandler";
import iterationHandler from "./handlers/iterationHandler";
import iteratorHandler from "./handlers/iteratorHandler";
import producerArrayHandler from "./handlers/array/producerHandler";
import pickingArrayHandler from "./handlers/array/pickingHandler";
import conflictArrayHandler from "./handlers/array/conflictHandler";
import { checkCache, getRawTry, isPlainObject } from "./utils";
import { CacheParentsProxy, CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

function passThis<
  P extends ([target: any, cache: CacheProxy, ...args: any[]]),
  T extends ((...params: P) => any),
>(
  handler: T,
  ...params: P
) {
  return function (this: any, ...args: any[]) {
    const [target, cache] = params;
    let thisArg: any;
    if (isPlainObject(target)) {
      thisArg = this;
    } else {
      thisArg = getRawTry(this);
    }
    checkCache(this, cache);
    return handler.apply(thisArg, params.concat(args) as P);
  }
}

/**
 * Packs and binds all handler functions with shared context.
 *
 * Each handler receives the `target`, `key`, `cache`, and `onChange` references,
 * ensuring consistent behavior across mutation, lookup, and iteration operations.
 *
 * @param target The raw target object being proxied.
 * @param key The property key currently being accessed.
 * @param cache WeakMap used for proxy–raw mapping to maintain identity.
 * @param onChange Callback invoked when a reactive change occurs.
 * @returns An object containing all pre-bound handler functions.
 */
export default function packHandlers(
  target: any,
  key: any,
  cache: CacheProxy,
  cacheParents: CacheParentsProxy,
  onChange: OnChangeHandler,
) {
  return {
    conflictArrayHandler: passThis(conflictArrayHandler, target, cache, cacheParents, key, onChange),
    mutationArrayHandler: passThis(mutationArrayHandler, target, cache, key, onChange),
    producerArrayHandler: passThis(producerArrayHandler, target, cache, cacheParents, key, onChange),
    iterationHandler: passThis(iterationHandler, target, cache, cacheParents, key, onChange),
    iteratorHandler: passThis(iteratorHandler, target, cache, cacheParents, key, onChange),
    lookupArrayHandler: passThis(lookupArrayHandler, target, cache, key),
    pickingArrayHandler: passThis(pickingArrayHandler, target, cache, cacheParents, key, onChange),
    getHandler: passThis(getHandler, target, cache, cacheParents, onChange),
    setHandler: passThis(setHandler, target, cache, onChange),
    addHandler: passThis(addHandler, target, cache, onChange),
    hasHandler: passThis(hasHandler, target, cache),
    deleteHandler: passThis(deleteHandler, target, cache, onChange),
    clearHandler: passThis(clearHandler, target, cache, onChange),
    defaultHandler: passThis(defaultHandler, target, cache, key),
  }
}

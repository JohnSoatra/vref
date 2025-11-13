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
import { addFlag, getRawTry, isObject, isPlainObject, isProxy, removeFlag } from "./utils";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

function passThis<
  P extends ([target: any, ...args: any[]]),
  T extends ((...params: P) => any),
>(
  cache: CacheProxy,
  handler: T,
  ...params: P
) {
  return function (this: any, ...args: any[]) {
    const rawThis = getRawTry(this);
    const [target] = params;
    let thisArg: any;
    if (isPlainObject(target) || Array.isArray(target)) {
      thisArg = this;
    } else {
      thisArg = rawThis;
    }
    if (isObject(this) && isProxy(this)) {
      cache.set(rawThis, this);
    }
    return handler.apply(thisArg, params.concat(args) as P);
  }
}

/**
 * Packs and binds all handler functions with shared context.
 *
 * Each handler receives the `target`, `key`, `cache`, and `onChange` references,
 * ensuring consistent behavior across mutation, lookup, and iteration operations.
 *
 * @param proxy The proxy instance of the target.
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
  onChange: OnChangeHandler,
) {
  return {
    conflictArrayHandler: passThis(cache, conflictArrayHandler, target, key, cache, onChange),
    mutationArrayHandler: passThis(cache, mutationArrayHandler, target, key, cache, onChange),
    producerArrayHandler: passThis(cache, producerArrayHandler, target, key, cache, onChange),
    iterationHandler: passThis(cache, iterationHandler, target, key, cache, onChange),
    iteratorHandler: passThis(cache, iteratorHandler, target, key, cache, onChange),
    lookupArrayHandler: passThis(cache, lookupArrayHandler, target, key),
    pickingArrayHandler: passThis(cache, pickingArrayHandler, target, key, cache, onChange),
    getHandler: passThis(cache, getHandler, target, cache, onChange),
    setHandler: passThis(cache, setHandler, target, cache, onChange),
    addHandler: passThis(cache, addHandler, target, cache, onChange),
    hasHandler: passThis(cache, hasHandler, target),
    deleteHandler: passThis(cache, deleteHandler, target, cache, onChange),
    clearHandler: passThis(cache, clearHandler, target, cache, onChange),
    defaultHandler: passThis(cache, defaultHandler, target, key),
  }
}

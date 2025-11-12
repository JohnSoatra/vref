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
import { addFlag, getRawTry, isCreatable, isPlainObject, isProxy, removeFlag } from "./utils";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

function passThis<T extends ((...args: any[]) => any)>(
  handler: T,
  ...params: Parameters<T>
) {
  return function (this: any, ...args: any[]) {
    const thisIsProxy = isCreatable(this) && isProxy(this);
    const [target] = params;
    let thisArg: any;
    if (isPlainObject(target) || Array.isArray(target)) {
      thisArg = this;
    } else {
      thisArg = getRawTry(this);
    }
    thisIsProxy && addFlag(thisArg, 'is_proxy');
    const result = handler.apply(thisArg, params.concat(args));
    thisIsProxy && removeFlag(thisArg, 'is_proxy');
    return result;
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
    conflictArrayHandler: passThis(conflictArrayHandler, target, key, cache, onChange),
    mutationArrayHandler: passThis(mutationArrayHandler, target, key, onChange),
    producerArrayHandler: passThis(producerArrayHandler, target, key, cache, onChange),
    iterationHandler: passThis(iterationHandler, target, key, cache, onChange),
    iteratorHandler: passThis(iteratorHandler, target, key, cache, onChange),
    lookupArrayHandler: passThis(lookupArrayHandler, target, key),
    pickingArrayHandler: passThis(pickingArrayHandler, target, key, cache, onChange),
    getHandler: passThis(getHandler, target, cache, onChange),
    setHandler: passThis(setHandler, target, cache, onChange),
    addHandler: passThis(addHandler, target, cache, onChange),
    hasHandler: passThis(hasHandler, target),
    deleteHandler: passThis(deleteHandler, target, cache, onChange),
    clearHandler: passThis(clearHandler, target, cache, onChange),
    defaultHandler: passThis(defaultHandler, target, key),
  }
}

import lookupArrayHandler from "./handlers/array/lookupHandler";
import mutationArrayHandler from "./handlers/array/mutateHandler";
import addHandler from "./handlers/collection/addHandler";
import deleteHandler from "./handlers/collection/deleteHandler";
import getHandler from "./handlers/collection/getHandler";
import hasHandler from "./handlers/collection/hasHandler";
import setHandler from "./handlers/collection/setHandler";
import defaultHandler from "./handlers/defaultHandler";
import iterationHandler from "./handlers/iterationHandler";
import iteratorHandler from "./handlers/iteratorHandler";
import producerArrayHandler from "./handlers/array/producerHandler";
import { CacheProxy, CacheShallow } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

export default function packHandlers(
  proxy: any,
  target: any,
  key: any,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
) {
  return {
    iteratorHandler: () => iteratorHandler(target, key, cacheProxy, cacheShallow, onChange),
    iterationHandler: (...args: any[]) => iterationHandler(target, key, cacheProxy, cacheShallow, onChange, ...args),
    lookupArrayHandler: (...args: any[]) => lookupArrayHandler(target, key, ...args),
    mutationArrayHandler: (...args: any[]) => mutationArrayHandler(proxy, target, key, onChange, ...args),
    producerArrayHandler: (...args: any[]) => producerArrayHandler(target, key, cacheProxy, cacheShallow, onChange, ...args),
    getHandler: (getKey: any) => getHandler(target, getKey, cacheProxy, cacheShallow, onChange),
    setHandler: (setKey: any, setValue: any) => setHandler(proxy, target, setKey, setValue, onChange),
    addHandler: (addValue: any) => addHandler(proxy, target, addValue, onChange),
    hasHandler: (hasKey: any) => hasHandler(target, hasKey),
    deleteHandler: (deleteKey: any) => deleteHandler(proxy, target, deleteKey, onChange),
    defaultHandler: (...args: any[]) => defaultHandler(proxy, target, key, ...args),
  }
}

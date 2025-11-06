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
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

export default function packHandlers(
  proxy: any,
  target: any,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  return {
    iteratorHandler: () => iteratorHandler(target, key, cache, onChange),
    iterationHandler: (...args: any[]) => iterationHandler(target, key, cache, onChange, ...args),
    lookupArrayHandler: (...args: any[]) => lookupArrayHandler(target, key, ...args),
    mutationArrayHandler: (...args: any[]) => mutationArrayHandler(proxy, target, key, onChange, ...args),
    producerArrayHandler: (...args: any[]) => producerArrayHandler(target, key, cache, onChange, ...args),
    getHandler: (getKey: any) => getHandler(target, getKey, cache, onChange),
    setHandler: (setKey: any, setValue: any) => setHandler(proxy, target, setKey, setValue, cache, onChange),
    addHandler: (addValue: any) => addHandler(proxy, target, addValue, onChange),
    hasHandler: (hasKey: any) => hasHandler(target, hasKey),
    deleteHandler: (deleteKey: any) => deleteHandler(proxy, target, deleteKey, cache, onChange),
    defaultHandler: (...args: any[]) => defaultHandler(proxy, target, key, ...args),
  }
}

import { tryToCreateProxy, tryToGetRaw } from "../../utils";
import { CacheProxy, CacheShallow } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

export default function getHandler(
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
) {
  const result = target.get(tryToGetRaw(key));
  return tryToCreateProxy(result, cacheProxy, cacheShallow, onChange);
}

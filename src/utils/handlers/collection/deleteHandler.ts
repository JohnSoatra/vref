import { getWeakValue, getRawTry, deleteCacheTry, isMapCollection } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

export default function deleteHandler(
  proxy: any,
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  const rawKey = getRawTry(key);
  const prevValue = getWeakValue(target, rawKey);
  const deleted = target.delete(rawKey);
  if (deleted) {
    deleteCacheTry(rawKey, cache);
    if (isMapCollection(target)) {
      deleteCacheTry(prevValue, cache);
    }
    onChange({
      target: proxy,
      action: 'delete',
      key,
      value: undefined,
      prevValue
    });
  }
  return deleted;
}

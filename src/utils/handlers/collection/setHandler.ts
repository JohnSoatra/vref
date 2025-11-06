import { deleteCacheTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

export default function setHandler(
  proxy: any,
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  value: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  const rawKey = getRawTry(key);
  const rawValue = getRawTry(value);
  const prevValue = target.get(rawKey);
  if (!Object.is(rawValue, prevValue)) {
    target.set(rawKey, rawValue);
    deleteCacheTry(prevValue, cache);
    onChange({
      target: proxy,
      action: 'set',
      key,
      value,
      prevValue,
    });
  }
  return proxy;
}

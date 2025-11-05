import { getWeakValue, tryToGetRaw } from "../../utils";
import { OnChangeHandler } from "../../../types/ref";

export default function deleteHandler(
  proxy: any,
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: any,
  onChange: OnChangeHandler,
) {
  const rawKey = tryToGetRaw(key);
  const prevValue = getWeakValue(target, rawKey);
  const deleted = target.delete(rawKey);

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
}

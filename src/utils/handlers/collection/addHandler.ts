import { tryToGetRaw } from "../../utils";
import { OnChangeHandler } from "../../../types/ref";

export default function addHandler(
  proxy: any,
  target: Set<any> | WeakSet<any>,
  value: any,
  onChange: OnChangeHandler,
) {
  const rawValue = tryToGetRaw(value);
  const hasValue = target.has(rawValue);

  if (!hasValue) {
    target.add(rawValue);
    onChange({
      target: proxy,
      action: 'add',
      key: value,
      value,
      prevValue: undefined,
    });
  }

  return proxy;
}

import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

export default function getHandler(
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  return createProxyTry(target.get(getRawTry(key)), cache, onChange);
}

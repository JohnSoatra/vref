import { tryToGetRaw } from "../../utils";

export default function hasHandler(
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: object,
) {
  return target.has(tryToGetRaw(key));
}

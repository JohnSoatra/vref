import ProducerArrayMethods from "../../../constants/producerMethods/array";
import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy, CacheShallow } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

function producerArrayHandler(
  target: any[],
  key: typeof ProducerArrayMethods[number],
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = args.map(each => getRawTry(each));
  const newArray = target[key].apply(target, rawArgs);
  return newArray.map(each => createProxyTry(each, cacheProxy, cacheShallow, onChange, false));
}

export default producerArrayHandler;

import ProducerArrayMethods from "../../../constants/array";
import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

function producerArrayHandler(
  target: any[],
  key: typeof ProducerArrayMethods[number],
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = args.map(each => getRawTry(each));
  const newArray = target[key].apply(target, rawArgs);
  return newArray.map(each => createProxyTry(each, cache, onChange, false));
}

export default producerArrayHandler;

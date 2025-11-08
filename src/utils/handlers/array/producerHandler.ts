import ProducerArrayMethods from "../../../constants/producerMethods/array";
import Keys from "../../../constants/keys";
import { createCallbackArgs, toProxiedItems, toRawArgs } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

function producerArrayHandler(
  target: any[],
  key: typeof ProducerArrayMethods[number],
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any[];
  if (key === Keys.ToSorted) {
    const [compareFn] = createCallbackArgs(cache, onChange, args[0]);
    value = target.toSorted(compareFn);
  } else {
    const rawArgs = toRawArgs(args);
    value = target[key].apply(target, rawArgs);
  }
  return toProxiedItems(value, cache, onChange);
}

export default producerArrayHandler;

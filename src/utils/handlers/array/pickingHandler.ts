import PickingArrayMethods from "../../../constants/pickingMethods/array";
import Keys from "../../../constants/keys";
import { createCallbackArgs, createProxyTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

function pickingArrayHandler(
  target: any[],
  key: typeof PickingArrayMethods[number],
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any;
  if (key === Keys.At) {
    value = target.at(args[0]);
  } else {
    const [predicate, ...restArgs] = createCallbackArgs(cache, onChange, ...args);
    value = target[key](predicate, ...restArgs);
  }
  return createProxyTry(value, cache, onChange);
}

export default pickingArrayHandler;

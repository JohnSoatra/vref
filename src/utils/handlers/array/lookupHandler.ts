import LookupArrayMethods from "../../../constants/lookupMethods/array";
import { getRawTry } from "../../utils";

function lookupArrayHandler(
  target: any[],
  key: typeof LookupArrayMethods[number],
  ...args: any[]
) {
  const [value, ...restArgs] = args;
  return target[key](getRawTry(value), ...restArgs);
}

export default lookupArrayHandler;

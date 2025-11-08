import LookupArrayMethods from "../../../constants/lookupMethods/array";
import { toRawArgs } from "../../utils";

function lookupArrayHandler(
  target: any[],
  key: typeof LookupArrayMethods[number],
  ...args: any[]
) {
  const [searchElement, fromIndex] = toRawArgs(args);
  return target[key](searchElement, fromIndex);
}

export default lookupArrayHandler;

import LookupArrayMethods from "../../../constants/lookupMethods/array";
import { getRawTry } from "../../utils";

function lookupArrayHandler(
  target: any[],
  key: typeof LookupArrayMethods[number],
  ...args: any[]
) {
  return target[key](getRawTry(args[0]), ...args.slice(1));
}

export default lookupArrayHandler;

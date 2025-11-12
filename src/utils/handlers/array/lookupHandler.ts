import { toRawArgs } from "../../utils";
import { LookupArrayMethods } from "../../../constants/lookupMethods/array";

/**
 * Handles "lookup" methods on arrays such as `includes`, `indexOf`, and `lastIndexOf`.
 * Converts any proxied arguments to raw values before calling the native method.
 */
function lookupArrayHandler(
  this: any,
  target: any[],
  key: LookupArrayMethods,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  return (target as any)[key].apply(this, rawArgs);
}

export default lookupArrayHandler;

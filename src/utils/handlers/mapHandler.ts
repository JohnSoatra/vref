import createProxy from "../createProxy";
import { creatable, isProxy } from "../utils";
import { OnChange } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function mapHandler(
  target: any,
  key: any,
  value: Map<any, any>,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
) {
  let shallow: Map<any, any>;

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = new Map(value);
    target[key] = shallow;
    cacheShallow.set(value, shallow);
  }

  for (const [prevKey, prevValue] of shallow) {
    let newKey;
    let newValue;

    if (creatable(prevKey) && !isProxy(prevKey)) {
      if (cacheProxy.has(prevKey)) {
        newKey = cacheProxy.get(prevKey);
      } else {
        newKey = createProxy(prevKey, cacheProxy, cacheShallow, onChange);
      }
    } else {
      newKey = prevKey;
    }

    if (creatable(prevValue) && !isProxy(prevValue)) {
      if (cacheProxy.has(prevValue)) {
        newValue = cacheProxy.get(prevValue);
      } else {
        newValue = createProxy(prevValue, cacheProxy, cacheShallow, onChange);
      }
    } else {
      newValue = prevValue;
    }

    if (!(Object.is(prevKey, newKey) && Object.is(prevValue, newValue))) {
      shallow.delete(prevKey);
      shallow.set(newKey, newValue);
    }
  }

  return createProxy(shallow, cacheProxy, cacheShallow, onChange);
}

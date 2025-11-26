import createProxy from './utils/createProxy';
import { OnChangeHandler, Ref, RefOptions } from './types/ref';

/**
 * Creates a reactive reference object.
 *
 * - `value`: the reactive value.
 * - `onchange`: callback triggered on every change.
 * - `options.cache`: optional WeakMap for shared proxy identity.
 * - `options.cacheParents`: optional WeakMap for parents proxy.
 *
 * Example:
 * ```ts
 * const count = ref(0, (e) => console.log(e.value));
 * count.value = 5; // triggers onchange
 * ```
 *
 * @param initial Initial value.
 * @param onchange Callback that receives ChangeEvent on every change.
  * @param options Optional RefOptions for proxy identity (`cache`) and parent tracking (`cacheParents`).
 * @returns A reactive Ref object.
 */
function ref<T>(initial: T, onchange: OnChangeHandler, options?: RefOptions): Ref<T> {
  const cache = options?.cache ?? new WeakMap();
  const cacheParents = options?.cacheParents ?? new WeakMap();
  return createProxy(
    Object.preventExtensions({ value: initial }),
    undefined,
    cache,
    cacheParents,
    onchange
  );
}

export default ref;

import createProxy from './utils/createProxy';
import { OnChangeHandler, Ref, RefOptions } from './types/ref';

/**
 * Creates a reactive reference object.
 *
 * - `value`: the reactive value.
 * - `onchange`: callback triggered on every change.
 * - `options.cache`: optional WeakMap for shared proxy identity.
 *
 * Example:
 * ```ts
 * const count = ref(0, (e) => console.log(e.value));
 * count.value = 5; // triggers onchange
 * ```
 *
 * @param initial Initial value.
 * @param onchange Callback that receives ChangeEvent on every change.
 * @param options Optional RefOptions (only `cache` is used by ref).
 * @returns A reactive Ref object.
 */
function ref<T>(initial: T, onchange: OnChangeHandler, options?: RefOptions): Ref<T> {
  const cache = options?.cache ?? new WeakMap();
  const cacheParent = options?.cacheParents ?? new WeakMap();
  return createProxy(
    Object.preventExtensions({ value: initial }),
    undefined,
    cache,
    cacheParent,
    onchange
  );
}

export default ref;

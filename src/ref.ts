import Keys from './constants/keys';
import createProxy from './utils/createProxy';
import handleChange from './utils/handleChange';
import { getNow } from './utils/utils';
import { Changes, OnChangeHandler, Ref } from './types/ref';

/**
 * Creates a reactive reference object.
 *
 * The returned object has:
 * - `value`: the reactive value. Any changes to this value or nested objects/arrays will
 *   trigger the `onchange` callback if provided.
 * - `onchange`: optional callback that is called whenever the value changes. It can be
 *   reassigned later to change or reset the callback.
 *
 * Example usage:
 * ```ts
 * const count = ref(0, (event) => {
 *   console.log(event.value); // Logs the new value
 * });
 * count.value = 5; // Triggers onchange
 * ```
 *
 * @param initial The initial value of the reactive reference.
 * @param onchange Optional callback that is called whenever the value changes.
 * @returns A reactive reference object of type `Ref<T>` with `.value` and `.onchange`.
 */
function ref<T>(initial: T, onchange?: OnChangeHandler): Ref<T>;
function ref<T = undefined>(): Ref<T | undefined>;
function ref<T>(initial?: T, onchange?: OnChangeHandler): Ref<T | undefined> {
  let onChange: OnChangeHandler | undefined = onchange;
  const cacheProxy = new WeakMap();
  const cacheShallow = new WeakMap();
  const changes: Changes = {
    latest: getNow(),
    tick: 0,
    scheduled: false,
  }

  return new Proxy(
    createProxy(
      { value: initial },
      cacheProxy,
      cacheShallow,
      (props) => handleChange(changes, onChange, props),
    ),
    {
      get(target, key, receiver) {
        if (key === Keys.OnChange) {
          return onChange;
        }
        return Reflect.get(target, key, receiver);
      },
      set(target, key, newValue, receiver) {
        if (key === Keys.OnChange) {
          onChange = newValue;
          return true;
        }
        return Reflect.set(target, key, newValue, receiver);
      },
    }
  );
}

export default ref;

import createProxy from './utils/createProxy';
import handleChange from './utils/handleChange';
import { getNow, createOptions } from './utils/utils';
import { Ticks, OnChangeHandler, Ref, RefOptions } from './types/ref';

/**
 * Creates a reactive reference object.
 *
 * The returned object has:
 * - `value`: the reactive value of type `T`. Any changes to this value or nested objects/arrays
 *   will trigger the `onchange` callback if provided.
 * - `onchange`: optional callback that is called whenever the value changes. It can be
 *   reassigned later to change or reset the callback.
 * - `options`: optional configuration for the reference, including:
 *   - `maxTick`: maximum number of updates allowed in a single tick (1–300).
 *   - `maxTickMessage`: message to display or log when `maxTick` is exceeded.
 *   - `onchange`: a callback function to handle change events.
 *
 * Example usage:
 * ```ts
 * const count = ref(0, { maxTick: 100, maxTickMessage: 'Too many updates', onchange: (e) => console.log(e) });
 * count.value = 5; // Triggers the onchange callback
 * ```
 *
 * @param initial The initial value of the reactive reference.
 * @param onchangeOrOptions Optional callback or configuration object (`RefOptions`) that
 *   is used whenever the value changes.
 * @returns A reactive reference object of type `Ref<T>` with `.value` and reactive behavior
 *   controlled via options.
 */
function ref<T>(initial: T, onchange?: OnChangeHandler): Ref<T>;
function ref<T>(initial: T, options?: RefOptions): Ref<T>;
function ref<T = undefined>(): Ref<T | undefined>;
function ref<T>(initial?: T, onchangeOrOptions?: OnChangeHandler | RefOptions): Ref<T | undefined> {
  const options = createOptions(onchangeOrOptions);
  const cacheProxy = new WeakMap();
  const cacheShallow = new WeakMap();
  const ticks: Ticks = {
    latest: getNow(),
    tick: 0,
    scheduled: false,
  }
  return createProxy(
    { value: initial },
    cacheProxy,
    cacheShallow,
    (event) => handleChange(event, ticks, options),
  );
}

export default ref;

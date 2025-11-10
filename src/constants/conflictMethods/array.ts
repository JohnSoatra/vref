/**
 * Array methods that exhibit multiple reactive behaviors, potentially causing proxy conflicts.
 *
 * These methods can:
 *  - both iterate and produce new arrays (`filter`, `toSorted`, `splice`)
 *  - iterate while selecting specific elements (`find`, `findLast`)
 *  - mutate the array while returning removed elements (`pop`, `shift`)
 *  - both mutate and iterate (`sort`)
 *
 * Use these with the raw target rather than the proxied array to avoid inconsistent reactivity.
 */
const ConflictArrayMethods = new Set([
  'filter',     // iteration + producer
  'find',       // iteration + picking
  'findLast',   // iteration + picking
  'pop',        // mutation + picking
  'shift',      // mutation + picking
  'sort',       // iteration + mutation
  'splice',     // mutation + producer
  'toSorted',   // iteration + producer
] as const);

export type ConflictArrayMethods = typeof ConflictArrayMethods extends Set<infer T> ? T : never;
export default ConflictArrayMethods;

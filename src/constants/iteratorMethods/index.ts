const IteratorMethods = new Set([
  'entries',
  'keys',
  'values',
  Symbol.iterator,
] as const);

export type IteratorMethods = typeof IteratorMethods extends Set<infer T> ? T: never;
export default IteratorMethods;

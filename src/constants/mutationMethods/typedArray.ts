const MutationTypedArrayMethods = new Set([
  'copyWithin',
  'fill',
  'reverse',
  'set',
  'sort',
] as const);

export type MutationTypedArrayMethods = typeof MutationTypedArrayMethods extends Set<infer T> ? T: never;
export default MutationTypedArrayMethods;

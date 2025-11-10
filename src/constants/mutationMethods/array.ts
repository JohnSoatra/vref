const MutationArrayMethods = new Set([
  'copyWithin',
  'fill',
  'push',
  'reverse',
  'unshift',
] as const);

export type MutationArrayMethods = typeof MutationArrayMethods extends Set<infer T> ? T: never;
export default MutationArrayMethods;

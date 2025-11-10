const ProducerArrayMethods = new Set([
  'concat',
  'flat',
  'slice',
  'toReversed',
  'toSpliced',
  'with',
] as const);

export type ProducerArrayMethods = typeof ProducerArrayMethods extends Set<infer T> ? T: never;
export default ProducerArrayMethods;

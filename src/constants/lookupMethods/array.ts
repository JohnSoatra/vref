const LookupArrayMethods = new Set([
  'includes',
  'indexOf',
  'lastIndexOf',
] as const);

export type LookupArrayMethods = typeof LookupArrayMethods extends Set<infer T> ? T: never;
export default LookupArrayMethods;

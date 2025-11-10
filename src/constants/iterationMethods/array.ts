const IterationArrayMethods = new Set([
  'every',
  'findIndex',
  'findLastIndex',
  'flatMap',
  'forEach',
  'map',
  'reduce',
  'reduceRight',
  'some',
] as const);

export type IterationArrayMethods = typeof IterationArrayMethods extends Set<infer T> ? T : never;
export default IterationArrayMethods;

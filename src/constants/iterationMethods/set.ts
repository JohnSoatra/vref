const IterationSetMethods = new Set(['forEach'] as const);

export type IterationSetMethods = typeof IterationSetMethods extends Set<infer T> ? T : never;
export default IterationSetMethods;

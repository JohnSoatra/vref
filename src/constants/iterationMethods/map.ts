const IterationMapMethods = new Set(['forEach'] as const);

export type IterationMapMethods = typeof IterationMapMethods extends Set<infer T> ? T : never;
export default IterationMapMethods;

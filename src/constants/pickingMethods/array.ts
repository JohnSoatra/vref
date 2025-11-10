const PickingArrayMethods = new Set(['at'] as const);

export type PickingArrayMethods = typeof PickingArrayMethods extends Set<infer T> ? T: never;
export default PickingArrayMethods;

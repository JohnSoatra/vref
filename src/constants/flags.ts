const Flags = new Map([
 ['batch', Symbol('flag_batch')],
 ['is_proxy', Symbol('flag_is_proxy')],
] as const);

export type Flags = typeof Flags extends Map<infer K, any> ? K : never;
export default Flags;

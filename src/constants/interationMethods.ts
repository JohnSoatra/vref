const IterationMethods = new Map<any, string[]>([
  [Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Map, ['forEach', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Set, ['forEach', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Int8Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Int16Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Int32Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [BigInt64Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [BigUint64Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Float32Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Float64Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Uint8Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Uint8ClampedArray, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Uint16Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
  [Uint32Array, ['forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'find', 'findIndex', 'entries', 'keys', 'values', Symbol.iterator as any]],
]);

export default IterationMethods;

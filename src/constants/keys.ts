const Keys = {
  Get: 'get',
  Set: 'set',
  Add: 'add',
  Has: 'has',
  Delete: 'delete',
  Clear: 'clear',
  ReduceKeys: new Set(['reduce', 'reduceRight']),
  ForbiddenKeys: new Set(['__proto__', 'constructor', 'prototype']),
} as const;

export default Keys;

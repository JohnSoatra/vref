const Keys = {
  Get: 'get',
  Add: 'add',
  Set: 'set',
  Has: 'has',
  Delete: 'delete',
  OnChange: 'onchange',
  ForbiddenKeys: ['__proto__', 'constructor', 'prototype'] as string[],
} as const;

export default Keys;

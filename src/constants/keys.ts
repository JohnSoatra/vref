const Keys = {
  At: 'at',
  Get: 'get',
  Set: 'set',
  Add: 'add',
  Has: 'has',
  Delete: 'delete',
  Pop: 'pop',
  Shift: 'shift',
  Sort: 'sort',
  Splice: 'splice',
  ToSorted: 'toSorted',
  OnChange: 'onchange',
  ForbiddenKeys: ['__proto__', 'constructor', 'prototype'],
} as const;

export default Keys;

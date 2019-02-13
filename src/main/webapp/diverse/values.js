export function isUndef(v) {
  return (v === (void 0));
}

export function isNumber(v) {
  return ((typeof v === 'number') && (!Number.isNaN(v)));
}

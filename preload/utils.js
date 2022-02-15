/** @type {<T>(fn: () => T, ttl: number) => (() => T) & { invalidate: () => void }} */
exports.cachedFn = (fn, ttl) => {
  let cachedValue;
  let expiresAt = -1;

  const retFn = () => {
    if (expiresAt < Date.now()) {
      expiresAt = Date.now() + ttl;
      cachedValue = fn();
    }
    return cachedValue;
  };

  retFn.invalidate = () => {
    expiresAt = -1;
  };

  return retFn;
};

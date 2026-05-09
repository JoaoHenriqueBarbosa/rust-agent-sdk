// function: areMcpConfigsEqual
function areMcpConfigsEqual(a2, b) {
  if (a2.type !== b.type)
    return !1;
  let { scope: _scopeA, ...configA } = a2, { scope: _scopeB, ...configB } = b;
  return jsonStringify(configA) === jsonStringify(configB);
}

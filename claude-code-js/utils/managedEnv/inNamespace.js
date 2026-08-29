// function: inNamespace
function inNamespace(hashValue, namespace) {
  let n6 = hash("__" + namespace[0], hashValue, 1);
  if (n6 === null)
    return !1;
  return n6 >= namespace[1] && n6 < namespace[2];
}

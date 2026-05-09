// function: isEmptyObj
function isEmptyObj(obj) {
  if (!obj)
    return !0;
  for (let _k in obj)
    return !1;
  return !0;
}

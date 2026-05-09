// var: _json3
var _json3 = (obj) => {
  if (obj == null)
    return {};
  if (Array.isArray(obj))
    return obj.filter((_) => _ != null).map(_json3);
  if (typeof obj === "object") {
    let target = {};
    for (let key of Object.keys(obj)) {
      if (obj[key] == null)
        continue;
      target[key] = _json3(obj[key]);
    }
    return target;
  }
  return obj;
};

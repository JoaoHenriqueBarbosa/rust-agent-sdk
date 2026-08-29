// var: _json2
var _json2 = (obj) => {
  if (obj == null)
    return {};
  if (Array.isArray(obj))
    return obj.filter((_) => _ != null).map(_json2);
  if (typeof obj === "object") {
    let target = {};
    for (let key of Object.keys(obj)) {
      if (obj[key] == null)
        continue;
      target[key] = _json2(obj[key]);
    }
    return target;
  }
  return obj;
};

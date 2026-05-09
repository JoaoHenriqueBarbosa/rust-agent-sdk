// var: _json4
var _json4 = (obj) => {
  if (obj == null)
    return {};
  if (Array.isArray(obj))
    return obj.filter((_) => _ != null).map(_json4);
  if (typeof obj === "object") {
    let target = {};
    for (let key of Object.keys(obj)) {
      if (obj[key] == null)
        continue;
      target[key] = _json4(obj[key]);
    }
    return target;
  }
  return obj;
};

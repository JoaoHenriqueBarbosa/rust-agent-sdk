// var: _json
var _json = (obj) => {
  if (obj == null)
    return {};
  if (Array.isArray(obj))
    return obj.filter((_) => _ != null).map(_json);
  if (typeof obj === "object") {
    let target = {};
    for (let key of Object.keys(obj)) {
      if (obj[key] == null)
        continue;
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};

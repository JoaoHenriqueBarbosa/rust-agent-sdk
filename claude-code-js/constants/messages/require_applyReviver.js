// var: require_applyReviver
var require_applyReviver = __commonJS((exports) => {
  function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === "object")
      if (Array.isArray(val))
        for (let i4 = 0, len = val.length;i4 < len; ++i4) {
          let v0 = val[i4], v12 = applyReviver(reviver, val, String(i4), v0);
          if (v12 === void 0)
            delete val[i4];
          else if (v12 !== v0)
            val[i4] = v12;
        }
      else if (val instanceof Map)
        for (let k3 of Array.from(val.keys())) {
          let v0 = val.get(k3), v12 = applyReviver(reviver, val, k3, v0);
          if (v12 === void 0)
            val.delete(k3);
          else if (v12 !== v0)
            val.set(k3, v12);
        }
      else if (val instanceof Set)
        for (let v0 of Array.from(val)) {
          let v12 = applyReviver(reviver, val, v0, v0);
          if (v12 === void 0)
            val.delete(v0);
          else if (v12 !== v0)
            val.delete(v0), val.add(v12);
        }
      else
        for (let [k3, v0] of Object.entries(val)) {
          let v12 = applyReviver(reviver, val, k3, v0);
          if (v12 === void 0)
            delete val[k3];
          else if (v12 !== v0)
            val[k3] = v12;
        }
    return reviver.call(obj, key, val);
  }
  exports.applyReviver = applyReviver;
});

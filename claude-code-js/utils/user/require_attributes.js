// var: require_attributes
var require_attributes = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.isAttributeValue = exports.isAttributeKey = exports.sanitizeAttributes = void 0;
  var api_1 = require_src7();
  function sanitizeAttributes(attributes) {
    let out = {};
    if (typeof attributes !== "object" || attributes == null)
      return out;
    for (let key2 in attributes) {
      if (!Object.prototype.hasOwnProperty.call(attributes, key2))
        continue;
      if (!isAttributeKey(key2)) {
        api_1.diag.warn(`Invalid attribute key: ${key2}`);
        continue;
      }
      let val = attributes[key2];
      if (!isAttributeValue(val)) {
        api_1.diag.warn(`Invalid attribute value set for key: ${key2}`);
        continue;
      }
      if (Array.isArray(val))
        out[key2] = val.slice();
      else
        out[key2] = val;
    }
    return out;
  }
  exports.sanitizeAttributes = sanitizeAttributes;
  function isAttributeKey(key2) {
    return typeof key2 === "string" && key2 !== "";
  }
  exports.isAttributeKey = isAttributeKey;
  function isAttributeValue(val) {
    if (val == null)
      return !0;
    if (Array.isArray(val))
      return isHomogeneousAttributeValueArray(val);
    return isValidPrimitiveAttributeValueType(typeof val);
  }
  exports.isAttributeValue = isAttributeValue;
  function isHomogeneousAttributeValueArray(arr) {
    let type;
    for (let element of arr) {
      if (element == null)
        continue;
      let elementType = typeof element;
      if (elementType === type)
        continue;
      if (!type) {
        if (isValidPrimitiveAttributeValueType(elementType)) {
          type = elementType;
          continue;
        }
        return !1;
      }
      return !1;
    }
    return !0;
  }
  function isValidPrimitiveAttributeValueType(valType) {
    switch (valType) {
      case "number":
      case "boolean":
      case "string":
        return !0;
    }
    return !1;
  }
});

// function: toURLEncodedForm
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams, {
    visitor: function(value, key, path9, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value))
        return this.append(key, value.toString("base64")), !1;
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}

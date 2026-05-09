// function: normalizeValue
function normalizeValue(value) {
  if (value === !1 || value == null)
    return value;
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value).replace(/[\r\n]+$/, "");
}

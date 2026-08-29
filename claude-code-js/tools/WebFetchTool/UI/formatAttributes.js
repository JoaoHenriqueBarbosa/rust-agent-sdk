// function: formatAttributes
function formatAttributes(attributes, opts) {
  var _a4;
  if (!attributes)
    return;
  let encode9 = ((_a4 = opts.encodeEntities) !== null && _a4 !== void 0 ? _a4 : opts.decodeEntities) === !1 ? replaceQuotes : opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML : escapeAttribute;
  return Object.keys(attributes).map((key2) => {
    var _a5, _b2;
    let value = (_a5 = attributes[key2]) !== null && _a5 !== void 0 ? _a5 : "";
    if (opts.xmlMode === "foreign")
      key2 = (_b2 = attributeNames.get(key2)) !== null && _b2 !== void 0 ? _b2 : key2;
    if (!opts.emptyAttrs && !opts.xmlMode && value === "")
      return key2;
    return `${key2}="${encode9(value)}"`;
  }).join(" ");
}

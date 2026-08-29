// function: renderText
function renderText(elem, opts) {
  var _a4;
  let data = elem.data || "";
  if (((_a4 = opts.encodeEntities) !== null && _a4 !== void 0 ? _a4 : opts.decodeEntities) !== !1 && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name)))
    data = opts.xmlMode || opts.encodeEntities !== "utf8" ? encodeXML(data) : escapeText(data);
  return data;
}

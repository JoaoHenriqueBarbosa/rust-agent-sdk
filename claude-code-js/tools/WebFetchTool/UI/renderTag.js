// function: renderTag
function renderTag(elem, opts) {
  var _a4;
  if (opts.xmlMode === "foreign") {
    if (elem.name = (_a4 = elementNames.get(elem.name)) !== null && _a4 !== void 0 ? _a4 : elem.name, elem.parent && foreignModeIntegrationPoints.has(elem.parent.name))
      opts = { ...opts, xmlMode: !1 };
  }
  if (!opts.xmlMode && foreignElements.has(elem.name))
    opts = { ...opts, xmlMode: "foreign" };
  let tag2 = `<${elem.name}`, attribs = formatAttributes(elem.attribs, opts);
  if (attribs)
    tag2 += ` ${attribs}`;
  if (elem.children.length === 0 && (opts.xmlMode ? opts.selfClosingTags !== !1 : opts.selfClosingTags && singleTag.has(elem.name))) {
    if (!opts.xmlMode)
      tag2 += " ";
    tag2 += "/>";
  } else {
    if (tag2 += ">", elem.children.length > 0)
      tag2 += render2(elem.children, opts);
    if (opts.xmlMode || !singleTag.has(elem.name))
      tag2 += `</${elem.name}>`;
  }
  return tag2;
}

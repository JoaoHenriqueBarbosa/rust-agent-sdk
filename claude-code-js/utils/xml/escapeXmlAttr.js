// function: escapeXmlAttr
function escapeXmlAttr(s2) {
  return escapeXml(s2).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// var: XML_ATTRKEY
var XML_ATTRKEY = "$", XML_CHARKEY = "_";

// node_modules/@azure/core-client/dist/esm/utils.js
function isPrimitiveBody(value, mapperTypeName) {
  return mapperTypeName !== "Composite" && mapperTypeName !== "Dictionary" && (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || mapperTypeName?.match(/^(Date|DateTime|DateTimeRfc1123|UnixTime|ByteArray|Base64Url)$/i) !== null || value === void 0 || value === null);
}

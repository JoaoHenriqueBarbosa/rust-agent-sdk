// function: buildParseScript
function buildParseScript(command12) {
  return `$EncodedCommand = '${typeof Buffer < "u" ? Buffer.from(command12, "utf8").toString("base64") : btoa((/* @__PURE__ */ new TextEncoder()).encode(command12).reduce((s2, b) => s2 + String.fromCharCode(b), ""))}'
${PARSE_SCRIPT_BODY}`;
}

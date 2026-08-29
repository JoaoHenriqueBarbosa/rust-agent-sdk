// function: normalizeUserTextContent
function normalizeUserTextContent(a2) {
  if (typeof a2 === "string")
    return [{ type: "text", text: a2 }];
  return a2;
}

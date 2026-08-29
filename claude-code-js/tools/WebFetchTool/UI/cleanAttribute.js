// function: cleanAttribute
function cleanAttribute(attribute2) {
  return attribute2 ? attribute2.replace(/(\n+\s*)+/g, `
`) : "";
}

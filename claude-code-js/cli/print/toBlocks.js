// function: toBlocks
function toBlocks(v2) {
  return typeof v2 === "string" ? [{ type: "text", text: v2 }] : v2;
}

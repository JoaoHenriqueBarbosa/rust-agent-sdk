// function: extractTextContent
function extractTextContent(blocks, separator = "") {
  return blocks.filter((b) => b.type === "text").map((b) => b.text).join(separator);
}

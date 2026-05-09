// function: getContentText
function getContentText(content) {
  if (typeof content === "string")
    return content;
  if (Array.isArray(content))
    return extractTextContent(content, `
`).trim() || null;
  return null;
}

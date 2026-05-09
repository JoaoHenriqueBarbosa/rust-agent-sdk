// function: escapeHtmlWithBold
function escapeHtmlWithBold(text2) {
  return escapeXmlAttr(text2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

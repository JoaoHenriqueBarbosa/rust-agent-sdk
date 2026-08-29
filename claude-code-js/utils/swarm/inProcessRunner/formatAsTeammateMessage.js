// function: formatAsTeammateMessage
function formatAsTeammateMessage(from, content, color2, summary) {
  let colorAttr = color2 ? ` color="${color2}"` : "", summaryAttr = summary ? ` summary="${summary}"` : "";
  return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${from}"${colorAttr}${summaryAttr}>
${content}
</${TEAMMATE_MESSAGE_TAG}>`;
}

// function: formatTeammateMessages
function formatTeammateMessages(messages) {
  return messages.map((m4) => {
    let colorAttr = m4.color ? ` color="${m4.color}"` : "", summaryAttr = m4.summary ? ` summary="${m4.summary}"` : "";
    return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${m4.from}"${colorAttr}${summaryAttr}>
${m4.text}
</${TEAMMATE_MESSAGE_TAG}>`;
  }).join(`

`);
}

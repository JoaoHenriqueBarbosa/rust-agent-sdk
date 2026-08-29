// function: formatTranscriptForFacets
function formatTranscriptForFacets(log3) {
  let lines2 = [], meta = logToSessionMeta(log3);
  lines2.push(`Session: ${meta.session_id.slice(0, 8)}`), lines2.push(`Date: ${meta.start_time}`), lines2.push(`Project: ${meta.project_path}`), lines2.push(`Duration: ${meta.duration_minutes} min`), lines2.push("");
  for (let msg of log3.messages)
    if (msg.type === "user" && msg.message) {
      let content = msg.message.content;
      if (typeof content === "string")
        lines2.push(`[User]: ${content.slice(0, 500)}`);
      else if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "text" && "text" in block2)
            lines2.push(`[User]: ${block2.text.slice(0, 500)}`);
      }
    } else if (msg.type === "assistant" && msg.message) {
      let content = msg.message.content;
      if (Array.isArray(content)) {
        for (let block2 of content)
          if (block2.type === "text" && "text" in block2)
            lines2.push(`[Assistant]: ${block2.text.slice(0, 300)}`);
          else if (block2.type === "tool_use" && "name" in block2)
            lines2.push(`[Tool: ${block2.name}]`);
      }
    }
  return lines2.join(`
`);
}

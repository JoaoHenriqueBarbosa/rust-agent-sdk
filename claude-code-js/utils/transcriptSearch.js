// Original: src/utils/transcriptSearch.ts
function renderableSearchText(msg) {
  let cached3 = searchTextCache.get(msg);
  if (cached3 !== void 0)
    return cached3;
  let result = computeSearchText(msg).toLowerCase();
  return searchTextCache.set(msg, result), result;
}
function computeSearchText(msg) {
  let raw = "";
  switch (msg.type) {
    case "user": {
      let c3 = msg.message.content;
      if (typeof c3 === "string")
        raw = RENDERED_AS_SENTINEL.has(c3) ? "" : c3;
      else {
        let parts = [];
        for (let b of c3)
          if (b.type === "text") {
            if (!RENDERED_AS_SENTINEL.has(b.text))
              parts.push(b.text);
          } else if (b.type === "tool_result")
            parts.push(toolResultSearchText(msg.toolUseResult));
        raw = parts.join(`
`);
      }
      break;
    }
    case "assistant": {
      let c3 = msg.message.content;
      if (Array.isArray(c3))
        raw = c3.flatMap((b) => {
          if (b.type === "text")
            return [b.text];
          if (b.type === "tool_use")
            return [toolUseSearchText(b.input)];
          return [];
        }).join(`
`);
      break;
    }
    case "attachment": {
      if (msg.attachment.type === "relevant_memories")
        raw = msg.attachment.memories.map((m4) => m4.content).join(`
`);
      else if (msg.attachment.type === "queued_command" && msg.attachment.commandMode !== "task-notification" && !msg.attachment.isMeta) {
        let p4 = msg.attachment.prompt;
        raw = typeof p4 === "string" ? p4 : p4.flatMap((b) => b.type === "text" ? [b.text] : []).join(`
`);
      }
      break;
    }
    case "collapsed_read_search": {
      if (msg.relevantMemories)
        raw = msg.relevantMemories.map((m4) => m4.content).join(`
`);
      break;
    }
    default:
      break;
  }
  let t2 = raw, open12 = t2.indexOf("<system-reminder>");
  while (open12 >= 0) {
    let close = t2.indexOf(SYSTEM_REMINDER_CLOSE, open12);
    if (close < 0)
      break;
    t2 = t2.slice(0, open12) + t2.slice(close + SYSTEM_REMINDER_CLOSE.length), open12 = t2.indexOf("<system-reminder>");
  }
  return t2;
}
function toolUseSearchText(input) {
  if (!input || typeof input !== "object")
    return "";
  let o5 = input, parts = [];
  for (let k3 of [
    "command",
    "pattern",
    "file_path",
    "path",
    "prompt",
    "description",
    "query",
    "url",
    "skill"
  ]) {
    let v2 = o5[k3];
    if (typeof v2 === "string")
      parts.push(v2);
  }
  for (let k3 of ["args", "files"]) {
    let v2 = o5[k3];
    if (Array.isArray(v2) && v2.every((x4) => typeof x4 === "string"))
      parts.push(v2.join(" "));
  }
  return parts.join(`
`);
}
function toolResultSearchText(r4) {
  if (!r4 || typeof r4 !== "object")
    return typeof r4 === "string" ? r4 : "";
  let o5 = r4;
  if (typeof o5.stdout === "string") {
    let err2 = typeof o5.stderr === "string" ? o5.stderr : "";
    return o5.stdout + (err2 ? `
` + err2 : "");
  }
  if (o5.file && typeof o5.file === "object" && typeof o5.file.content === "string")
    return o5.file.content;
  let parts = [];
  for (let k3 of ["content", "output", "result", "text", "message"]) {
    let v2 = o5[k3];
    if (typeof v2 === "string")
      parts.push(v2);
  }
  for (let k3 of ["filenames", "lines", "results"]) {
    let v2 = o5[k3];
    if (Array.isArray(v2) && v2.every((x4) => typeof x4 === "string"))
      parts.push(v2.join(`
`));
  }
  return parts.join(`
`);
}
var SYSTEM_REMINDER_CLOSE = "</system-reminder>", RENDERED_AS_SENTINEL, searchTextCache;
var init_transcriptSearch = __esm(() => {
  init_messages3();
  RENDERED_AS_SENTINEL = /* @__PURE__ */ new Set([
    INTERRUPT_MESSAGE,
    INTERRUPT_MESSAGE_FOR_TOOL_USE
  ]), searchTextCache = /* @__PURE__ */ new WeakMap;
});

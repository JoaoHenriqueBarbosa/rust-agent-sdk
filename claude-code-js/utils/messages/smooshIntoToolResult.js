// function: smooshIntoToolResult
function smooshIntoToolResult(tr, blocks) {
  if (blocks.length === 0)
    return tr;
  let existing = tr.content;
  if (Array.isArray(existing) && existing.some(isToolReferenceBlock))
    return null;
  if (tr.is_error) {
    if (blocks = blocks.filter((b) => b.type === "text"), blocks.length === 0)
      return tr;
  }
  if (blocks.every((b) => b.type === "text") && (existing === void 0 || typeof existing === "string")) {
    let joined = [
      (existing ?? "").trim(),
      ...blocks.map((b) => b.text.trim())
    ].filter(Boolean).join(`

`);
    return { ...tr, content: joined };
  }
  let base2 = existing === void 0 ? [] : typeof existing === "string" ? existing.trim() ? [{ type: "text", text: existing.trim() }] : [] : [...existing], merged = [];
  for (let b of [...base2, ...blocks])
    if (b.type === "text") {
      let t2 = b.text.trim();
      if (!t2)
        continue;
      let prev = merged.at(-1);
      if (prev?.type === "text")
        merged[merged.length - 1] = { ...prev, text: `${prev.text}

${t2}` };
      else
        merged.push({ type: "text", text: t2 });
    } else
      merged.push(b);
  return { ...tr, content: merged };
}

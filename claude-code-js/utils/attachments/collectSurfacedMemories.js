// function: collectSurfacedMemories
function collectSurfacedMemories(messages) {
  let paths2 = /* @__PURE__ */ new Set, totalBytes = 0;
  for (let m4 of messages)
    if (m4.type === "attachment" && m4.attachment.type === "relevant_memories")
      for (let mem of m4.attachment.memories)
        paths2.add(mem.path), totalBytes += mem.content.length;
  return { paths: paths2, totalBytes };
}

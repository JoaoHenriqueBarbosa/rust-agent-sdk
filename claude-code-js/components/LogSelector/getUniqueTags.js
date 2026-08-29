// function: getUniqueTags
function getUniqueTags(logs2) {
  let tags = /* @__PURE__ */ new Set;
  for (let log3 of logs2)
    if (log3.tag)
      tags.add(log3.tag);
  return Array.from(tags).sort((a2, b) => a2.localeCompare(b));
}

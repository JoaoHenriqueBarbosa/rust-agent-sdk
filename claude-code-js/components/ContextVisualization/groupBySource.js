// function: groupBySource
function groupBySource(items) {
  let groups = /* @__PURE__ */ new Map;
  for (let item of items) {
    let key3 = getSourceDisplayName(item.source), existing = groups.get(key3) || [];
    existing.push(item), groups.set(key3, existing);
  }
  for (let [key3, group] of groups.entries())
    groups.set(key3, group.sort((a2, b) => b.tokens - a2.tokens));
  let orderedGroups = /* @__PURE__ */ new Map;
  for (let source of SOURCE_DISPLAY_ORDER) {
    let group = groups.get(source);
    if (group)
      orderedGroups.set(source, group);
  }
  return orderedGroups;
}

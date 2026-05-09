// function: deduplicateSessionBranches
function deduplicateSessionBranches(entries2) {
  let bestBySession = /* @__PURE__ */ new Map;
  for (let entry of entries2) {
    let id = entry.meta.session_id, existing = bestBySession.get(id);
    if (!existing || entry.meta.user_message_count > existing.meta.user_message_count || entry.meta.user_message_count === existing.meta.user_message_count && entry.meta.duration_minutes > existing.meta.duration_minutes)
      bestBySession.set(id, entry);
  }
  return [...bestBySession.values()];
}

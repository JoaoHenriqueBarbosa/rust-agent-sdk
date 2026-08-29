// function: isLegacyProgressEntry
function isLegacyProgressEntry(entry) {
  return typeof entry === "object" && entry !== null && "type" in entry && entry.type === "progress" && "uuid" in entry && typeof entry.uuid === "string";
}

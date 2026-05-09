// Original: src/memdir/memoryAge.ts
function memoryAgeDays(mtimeMs) {
  return Math.max(0, Math.floor((Date.now() - mtimeMs) / 86400000));
}
function memoryAge(mtimeMs) {
  let d = memoryAgeDays(mtimeMs);
  if (d === 0)
    return "today";
  if (d === 1)
    return "yesterday";
  return `${d} days ago`;
}
function memoryFreshnessText(mtimeMs) {
  let d = memoryAgeDays(mtimeMs);
  if (d <= 1)
    return "";
  return `This memory is ${d} days old. ` + "Memories are point-in-time observations, not live state \u2014 " + "claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.";
}
function memoryFreshnessNote(mtimeMs) {
  let text2 = memoryFreshnessText(mtimeMs);
  if (!text2)
    return "";
  return `<system-reminder>${text2}</system-reminder>
`;
}

// function: deriveUUID
function deriveUUID(parentUUID, index) {
  let hex = index.toString(16).padStart(12, "0");
  return `${parentUUID.slice(0, 24)}${hex}`;
}

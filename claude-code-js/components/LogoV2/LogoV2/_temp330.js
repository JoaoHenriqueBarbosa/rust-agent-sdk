// function: _temp330
function _temp330(current) {
  if (current.lastReleaseNotesSeen === "2.1.90")
    return current;
  return {
    ...current,
    lastReleaseNotesSeen: "2.1.90"
  };
}

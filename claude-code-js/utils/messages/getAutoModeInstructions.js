// function: getAutoModeInstructions
function getAutoModeInstructions(attachment) {
  if (attachment.reminderType === "sparse")
    return getAutoModeSparseInstructions();
  return getAutoModeFullInstructions();
}

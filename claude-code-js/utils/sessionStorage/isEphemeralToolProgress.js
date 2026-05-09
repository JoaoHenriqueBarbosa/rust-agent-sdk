// function: isEphemeralToolProgress
function isEphemeralToolProgress(dataType) {
  return typeof dataType === "string" && EPHEMERAL_PROGRESS_TYPES.has(dataType);
}

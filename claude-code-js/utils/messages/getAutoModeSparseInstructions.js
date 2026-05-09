// function: getAutoModeSparseInstructions
function getAutoModeSparseInstructions() {
  return wrapMessagesInSystemReminder([
    createUserMessage({ content: "Auto mode still active (see full instructions earlier in conversation). Execute autonomously, minimize interruptions, prefer action over planning.", isMeta: !0 })
  ]);
}

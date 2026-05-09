// function: teleportToRemoteWithErrorHandling
async function teleportToRemoteWithErrorHandling(root2, description, signal, branchName) {
  return await handleTeleportPrerequisites(root2, /* @__PURE__ */ new Set(["needsGitStash"])), teleportToRemote({
    initialMessage: description,
    signal,
    branchName,
    onBundleFail: (msg) => process.stderr.write(`
${msg}
`)
  });
}

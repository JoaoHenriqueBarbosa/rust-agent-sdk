// function: maybeRemoveApiKeyFromMacOSKeychainThrows
async function maybeRemoveApiKeyFromMacOSKeychainThrows() {
  if (process.platform === "darwin") {
    let storageServiceName = getMacOsKeychainStorageServiceName();
    if ((await execa(`security delete-generic-password -a $USER -s "${storageServiceName}"`, { shell: !0, reject: !1 })).exitCode !== 0)
      throw Error("Failed to delete keychain entry");
  }
}

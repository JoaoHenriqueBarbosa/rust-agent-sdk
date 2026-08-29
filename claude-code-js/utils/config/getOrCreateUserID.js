// function: getOrCreateUserID
function getOrCreateUserID() {
  let config5 = getGlobalConfig();
  if (config5.userID)
    return config5.userID;
  let userID = randomBytes(32).toString("hex");
  return saveGlobalConfig((current) => ({ ...current, userID })), userID;
}

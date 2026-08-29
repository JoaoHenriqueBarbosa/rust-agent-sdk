// function: sendIdleNotification
async function sendIdleNotification(agentName, agentColor, teamName, options2) {
  let notification = createIdleNotification(agentName, options2);
  await sendMessageToLeader(agentName, jsonStringify(notification), agentColor, teamName);
}

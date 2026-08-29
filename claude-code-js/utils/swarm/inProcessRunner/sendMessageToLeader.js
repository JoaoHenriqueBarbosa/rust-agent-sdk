// function: sendMessageToLeader
async function sendMessageToLeader(from, text2, color2, teamName) {
  await writeToMailbox(TEAM_LEAD_NAME, {
    from,
    text: text2,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    color: color2
  }, teamName);
}

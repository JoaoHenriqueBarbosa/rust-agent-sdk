// function: ensureInboxDir
async function ensureInboxDir(teamName) {
  let team = teamName || getTeamName() || "default", safeTeam = sanitizePathComponent(team), inboxDir = join71(getTeamsDir(), safeTeam, "inboxes");
  await mkdir12(inboxDir, { recursive: !0 }), logForDebugging(`[TeammateMailbox] Ensured inbox directory: ${inboxDir}`);
}

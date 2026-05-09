// function: maybeActivateBrief
function maybeActivateBrief(options2) {
  let briefFlag = options2.brief, briefEnv = isEnvTruthy(process.env.CLAUDE_CODE_BRIEF);
  if (!briefFlag && !briefEnv)
    return;
  let {
    isBriefEntitled: isBriefEntitled2
  } = (init_BriefTool(), __toCommonJS(exports_BriefTool)), entitled = isBriefEntitled2();
  if (entitled)
    setUserMsgOptIn(!0);
  logEvent("tengu_brief_mode_enabled", {
    enabled: entitled,
    gated: !entitled,
    source: briefEnv ? "env" : "flag"
  });
}

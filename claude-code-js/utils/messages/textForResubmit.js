// function: textForResubmit
function textForResubmit(msg) {
  let content = getUserMessageText(msg);
  if (content === null)
    return null;
  let bash = extractTag(content, "bash-input");
  if (bash)
    return { text: bash, mode: "bash" };
  let cmd = extractTag(content, COMMAND_NAME_TAG);
  if (cmd) {
    let args = extractTag(content, COMMAND_ARGS_TAG) ?? "";
    return { text: `${cmd} ${args}`, mode: "prompt" };
  }
  return { text: stripIdeContextTags(content), mode: "prompt" };
}

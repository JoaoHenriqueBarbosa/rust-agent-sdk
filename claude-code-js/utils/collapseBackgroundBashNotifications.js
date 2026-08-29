// Original: src/utils/collapseBackgroundBashNotifications.ts
function isCompletedBackgroundBash(msg) {
  if (msg.type !== "user")
    return !1;
  let content = msg.message.content[0];
  if (content?.type !== "text")
    return !1;
  if (!content.text.includes(`<${TASK_NOTIFICATION_TAG}`))
    return !1;
  if (extractTag(content.text, STATUS_TAG) !== "completed")
    return !1;
  return extractTag(content.text, SUMMARY_TAG)?.startsWith(BACKGROUND_BASH_SUMMARY_PREFIX) ?? !1;
}
function collapseBackgroundBashNotifications(messages, verbose) {
  if (!isFullscreenEnvEnabled())
    return messages;
  if (verbose)
    return messages;
  let result = [], i5 = 0;
  while (i5 < messages.length) {
    let msg = messages[i5];
    if (isCompletedBackgroundBash(msg)) {
      let count4 = 0;
      while (i5 < messages.length && isCompletedBackgroundBash(messages[i5]))
        count4++, i5++;
      if (count4 === 1)
        result.push(msg);
      else
        result.push({
          ...msg,
          message: {
            role: "user",
            content: [
              {
                type: "text",
                text: `<${TASK_NOTIFICATION_TAG}><${STATUS_TAG}>completed</${STATUS_TAG}><${SUMMARY_TAG}>${count4} background commands completed</${SUMMARY_TAG}></${TASK_NOTIFICATION_TAG}>`
              }
            ]
          }
        });
    } else
      result.push(msg), i5++;
  }
  return result;
}
var init_collapseBackgroundBashNotifications = __esm(() => {
  init_xml();
  init_LocalShellTask();
  init_fullscreen();
  init_messages3();
});

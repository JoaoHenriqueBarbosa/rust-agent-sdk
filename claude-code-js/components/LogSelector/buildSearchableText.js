// function: buildSearchableText
function buildSearchableText(log3) {
  let messageText = (log3.messages.length <= DEEP_SEARCH_MAX_MESSAGES ? log3.messages : [...log3.messages.slice(0, DEEP_SEARCH_CROP_SIZE), ...log3.messages.slice(-DEEP_SEARCH_CROP_SIZE)]).map(extractSearchableText).filter(Boolean).join(" "), fullText = `${[log3.customTitle, log3.summary, log3.firstPrompt, log3.gitBranch, log3.tag, log3.prNumber ? `PR #${log3.prNumber}` : void 0, log3.prRepository].filter(Boolean).join(" ")} ${messageText}`.trim();
  return fullText.length > DEEP_SEARCH_MAX_TEXT_LENGTH ? fullText.slice(0, DEEP_SEARCH_MAX_TEXT_LENGTH) : fullText;
}

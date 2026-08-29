// function: isEmptyMessageText
function isEmptyMessageText(text2) {
  return stripPromptXMLTags(text2).trim() === "" || text2.trim() === NO_CONTENT_MESSAGE;
}

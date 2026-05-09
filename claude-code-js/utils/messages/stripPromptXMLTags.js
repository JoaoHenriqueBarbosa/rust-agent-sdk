// function: stripPromptXMLTags
function stripPromptXMLTags(content) {
  return content.replace(STRIPPED_TAGS_RE, "").trim();
}

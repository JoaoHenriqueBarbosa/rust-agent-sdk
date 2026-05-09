// Original: src/utils/displayTags.ts
function stripDisplayTags(text) {
  return text.replace(XML_TAG_BLOCK_PATTERN, "").trim() || text;
}
function stripDisplayTagsAllowEmpty(text) {
  return text.replace(XML_TAG_BLOCK_PATTERN, "").trim();
}
function stripIdeContextTags(text) {
  return text.replace(IDE_CONTEXT_TAGS_PATTERN, "").trim();
}
var XML_TAG_BLOCK_PATTERN, IDE_CONTEXT_TAGS_PATTERN;
var init_displayTags = __esm(() => {
  XML_TAG_BLOCK_PATTERN = /<([a-z][\w-]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>\n?/g;
  IDE_CONTEXT_TAGS_PATTERN = /<(ide_opened_file|ide_selection)(?:\s[^>]*)?>[\s\S]*?<\/\1>\n?/g;
});

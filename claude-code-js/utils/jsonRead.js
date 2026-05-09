// Original: src/utils/jsonRead.ts
function stripBOM(content) {
  return content.startsWith("\uFEFF") ? content.slice(1) : content;
}

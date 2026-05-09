// Original: src/utils/contentArray.ts
function insertBlockAfterToolResults(content, block2) {
  let lastToolResultIndex = -1;
  for (let i5 = 0;i5 < content.length; i5++) {
    let item = content[i5];
    if (item && typeof item === "object" && "type" in item && item.type === "tool_result")
      lastToolResultIndex = i5;
  }
  if (lastToolResultIndex >= 0) {
    let insertPos = lastToolResultIndex + 1;
    if (content.splice(insertPos, 0, block2), insertPos === content.length - 1)
      content.push({ type: "text", text: "." });
  } else {
    let insertIndex = Math.max(0, content.length - 1);
    content.splice(insertIndex, 0, block2);
  }
}

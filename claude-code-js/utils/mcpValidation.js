// Original: src/utils/mcpValidation.ts
function getMaxMcpOutputTokens() {
  let envValue = process.env.MAX_MCP_OUTPUT_TOKENS;
  if (envValue) {
    let parsed = parseInt(envValue, 10);
    if (Number.isFinite(parsed) && parsed > 0)
      return parsed;
  }
  return DEFAULT_MAX_MCP_OUTPUT_TOKENS;
}
function isTextBlock(block2) {
  return block2.type === "text";
}
function isImageBlock(block2) {
  return block2.type === "image";
}
function getContentSizeEstimate(content) {
  if (!content)
    return 0;
  if (typeof content === "string")
    return roughTokenCountEstimation(content);
  return content.reduce((total, block2) => {
    if (isTextBlock(block2))
      return total + roughTokenCountEstimation(block2.text);
    else if (isImageBlock(block2))
      return total + IMAGE_TOKEN_ESTIMATE;
    return total;
  }, 0);
}
function getMaxMcpOutputChars() {
  return getMaxMcpOutputTokens() * 4;
}
function getTruncationMessage() {
  return `

[OUTPUT TRUNCATED - exceeded ${getMaxMcpOutputTokens()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`;
}
function truncateString(content, maxChars) {
  if (content.length <= maxChars)
    return content;
  return content.slice(0, maxChars);
}
async function truncateContentBlocks(blocks, maxChars) {
  let result = [], currentChars = 0;
  for (let block2 of blocks)
    if (isTextBlock(block2)) {
      let remainingChars = maxChars - currentChars;
      if (remainingChars <= 0)
        break;
      if (block2.text.length <= remainingChars)
        result.push(block2), currentChars += block2.text.length;
      else {
        result.push({ type: "text", text: block2.text.slice(0, remainingChars) });
        break;
      }
    } else if (isImageBlock(block2)) {
      let imageChars = IMAGE_TOKEN_ESTIMATE * 4;
      if (currentChars + imageChars <= maxChars)
        result.push(block2), currentChars += imageChars;
      else {
        let remainingChars = maxChars - currentChars;
        if (remainingChars > 0) {
          let remainingBytes = Math.floor(remainingChars * 0.75);
          try {
            let compressedBlock = await compressImageBlock(block2, remainingBytes);
            if (result.push(compressedBlock), compressedBlock.source.type === "base64")
              currentChars += compressedBlock.source.data.length;
            else
              currentChars += imageChars;
          } catch {}
        }
      }
    } else
      result.push(block2);
  return result;
}
async function mcpContentNeedsTruncation(content) {
  if (!content)
    return !1;
  if (getContentSizeEstimate(content) <= getMaxMcpOutputTokens() * MCP_TOKEN_COUNT_THRESHOLD_FACTOR)
    return !1;
  try {
    let tokenCount = await countMessagesTokensWithAPI(typeof content === "string" ? [{ role: "user", content }] : [{ role: "user", content }], []);
    return !!(tokenCount && tokenCount > getMaxMcpOutputTokens());
  } catch (error44) {
    return logError2(error44), !1;
  }
}
async function truncateMcpContent(content) {
  if (!content)
    return content;
  let maxChars = getMaxMcpOutputChars(), truncationMsg = getTruncationMessage();
  if (typeof content === "string")
    return truncateString(content, maxChars) + truncationMsg;
  else {
    let truncatedBlocks = await truncateContentBlocks(content, maxChars);
    return truncatedBlocks.push({ type: "text", text: truncationMsg }), truncatedBlocks;
  }
}
async function truncateMcpContentIfNeeded(content) {
  if (!await mcpContentNeedsTruncation(content))
    return content;
  return await truncateMcpContent(content);
}
var MCP_TOKEN_COUNT_THRESHOLD_FACTOR = 0.5, IMAGE_TOKEN_ESTIMATE = 1600, DEFAULT_MAX_MCP_OUTPUT_TOKENS = 25000;
var init_mcpValidation = __esm(() => {
  init_tokenEstimation();
  init_imageResizer();
  init_log3();
});

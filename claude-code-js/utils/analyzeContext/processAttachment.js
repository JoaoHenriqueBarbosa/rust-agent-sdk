// function: processAttachment
function processAttachment(msg, breakdown) {
  let contentStr = jsonStringify(msg.attachment), tokens = roughTokenCountEstimation(contentStr);
  breakdown.attachmentTokens += tokens;
  let attachType = msg.attachment.type || "unknown";
  breakdown.attachmentsByType.set(attachType, (breakdown.attachmentsByType.get(attachType) || 0) + tokens);
}

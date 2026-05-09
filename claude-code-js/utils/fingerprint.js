// Original: src/utils/fingerprint.ts
import { createHash as createHash21 } from "crypto";
function extractFirstMessageText(messages) {
  let firstUserMessage = messages.find((msg) => msg.type === "user");
  if (!firstUserMessage)
    return "";
  let content = firstUserMessage.message.content;
  if (typeof content === "string")
    return content;
  if (Array.isArray(content)) {
    let textBlock = content.find((block2) => block2.type === "text");
    if (textBlock && textBlock.type === "text")
      return textBlock.text;
  }
  return "";
}
function computeFingerprint(messageText, version6) {
  let chars = [4, 7, 20].map((i5) => messageText[i5] || "0").join(""), fingerprintInput = `${FINGERPRINT_SALT}${chars}${version6}`;
  return createHash21("sha256").update(fingerprintInput).digest("hex").slice(0, 3);
}
function computeFingerprintFromMessages(messages) {
  let firstMessageText = extractFirstMessageText(messages);
  return computeFingerprint(firstMessageText, "2.1.90");
}
var FINGERPRINT_SALT = "59cf53e54c78";
var init_fingerprint = () => {};

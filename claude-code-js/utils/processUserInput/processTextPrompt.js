// Original: src/utils/processUserInput/processTextPrompt.ts
import { randomUUID as randomUUID38 } from "crypto";
function processTextPrompt(input, imageContentBlocks, imagePasteIds, attachmentMessages, uuid8, permissionMode, isMeta) {
  let promptId = randomUUID38();
  setPromptId(promptId);
  let userPromptText = typeof input === "string" ? input : input.find((block2) => block2.type === "text")?.text || "";
  startInteractionSpan(userPromptText);
  let otelPromptText = typeof input === "string" ? input : input.findLast((block2) => block2.type === "text")?.text || "";
  if (otelPromptText)
    logOTelEvent("user_prompt", {
      prompt_length: String(otelPromptText.length),
      prompt: redactIfDisabled(otelPromptText),
      "prompt.id": promptId
    });
  let isNegative = matchesNegativeKeyword(userPromptText), isKeepGoing = matchesKeepGoingKeyword(userPromptText);
  if (logEvent("tengu_input_prompt", {
    is_negative: isNegative,
    is_keep_going: isKeepGoing
  }), imageContentBlocks.length > 0) {
    let textContent2 = typeof input === "string" ? input.trim() ? [{ type: "text", text: input }] : [] : input;
    return {
      messages: [createUserMessage({
        content: [...textContent2, ...imageContentBlocks],
        uuid: uuid8,
        imagePasteIds: imagePasteIds.length > 0 ? imagePasteIds : void 0,
        permissionMode,
        isMeta: isMeta || void 0
      }), ...attachmentMessages],
      shouldQuery: !0
    };
  }
  return {
    messages: [createUserMessage({
      content: input,
      uuid: uuid8,
      permissionMode,
      isMeta: isMeta || void 0
    }), ...attachmentMessages],
    shouldQuery: !0
  };
}
var init_processTextPrompt = __esm(() => {
  init_state();
  init_messages3();
  init_events();
  init_sessionTracing();
});

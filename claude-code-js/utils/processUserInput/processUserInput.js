// Original: src/utils/processUserInput/processUserInput.ts
import { randomUUID as randomUUID40 } from "crypto";
async function processUserInput({
  input,
  preExpansionInput,
  mode,
  setToolJSX,
  context: context7,
  pastedContents,
  ideSelection,
  messages,
  setUserInputOnProcessing,
  uuid: uuid8,
  isAlreadyProcessing,
  querySource,
  canUseTool,
  skipSlashCommands,
  bridgeOrigin,
  isMeta,
  skipAttachments
}) {
  let inputString = typeof input === "string" ? input : null;
  if (mode === "prompt" && inputString !== null && !isMeta)
    setUserInputOnProcessing?.(inputString);
  queryCheckpoint("query_process_user_input_base_start");
  let appState = context7.getAppState(), result = await processUserInputBase(input, mode, setToolJSX, context7, pastedContents, ideSelection, messages, uuid8, isAlreadyProcessing, querySource, canUseTool, appState.toolPermissionContext.mode, skipSlashCommands, bridgeOrigin, isMeta, skipAttachments, preExpansionInput);
  if (queryCheckpoint("query_process_user_input_base_end"), !result.shouldQuery)
    return result;
  queryCheckpoint("query_hooks_start");
  let inputMessage = getContentText(input) || "";
  for await (let hookResult of executeUserPromptSubmitHooks(inputMessage, appState.toolPermissionContext.mode, context7, context7.requestPrompt)) {
    if (hookResult.message?.type === "progress")
      continue;
    if (hookResult.blockingError) {
      let blockingMessage = getUserPromptSubmitHookBlockingMessage(hookResult.blockingError);
      return {
        messages: [
          createSystemMessage(`${blockingMessage}

Original prompt: ${input}`, "warning")
        ],
        shouldQuery: !1,
        allowedTools: result.allowedTools
      };
    }
    if (hookResult.preventContinuation) {
      let message = hookResult.stopReason ? `Operation stopped by hook: ${hookResult.stopReason}` : "Operation stopped by hook";
      return result.messages.push(createUserMessage({
        content: message
      })), result.shouldQuery = !1, result;
    }
    if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0)
      result.messages.push(createAttachmentMessage({
        type: "hook_additional_context",
        content: hookResult.additionalContexts.map(applyTruncation),
        hookName: "UserPromptSubmit",
        toolUseID: `hook-${randomUUID40()}`,
        hookEvent: "UserPromptSubmit"
      }));
    if (hookResult.message)
      switch (hookResult.message.attachment.type) {
        case "hook_success":
          if (!hookResult.message.attachment.content)
            break;
          result.messages.push({
            ...hookResult.message,
            attachment: {
              ...hookResult.message.attachment,
              content: applyTruncation(hookResult.message.attachment.content)
            }
          });
          break;
        default:
          result.messages.push(hookResult.message);
          break;
      }
  }
  return queryCheckpoint("query_hooks_end"), result;
}
function applyTruncation(content) {
  if (content.length > MAX_HOOK_OUTPUT_LENGTH)
    return `${content.substring(0, MAX_HOOK_OUTPUT_LENGTH)}\u2026 [output truncated - exceeded ${MAX_HOOK_OUTPUT_LENGTH} characters]`;
  return content;
}
async function processUserInputBase(input, mode, setToolJSX, context7, pastedContents, ideSelection, messages, uuid8, isAlreadyProcessing, querySource, canUseTool, permissionMode, skipSlashCommands, bridgeOrigin, isMeta, skipAttachments, preExpansionInput) {
  let inputString = null, precedingInputBlocks = [], imageMetadataTexts = [], normalizedInput = input;
  if (typeof input === "string")
    inputString = input;
  else if (input.length > 0) {
    queryCheckpoint("query_image_processing_start");
    let processedBlocks = [];
    for (let block2 of input)
      if (block2.type === "image") {
        let resized = await maybeResizeAndDownsampleImageBlock(block2);
        if (resized.dimensions) {
          let metadataText = createImageMetadataText(resized.dimensions);
          if (metadataText)
            imageMetadataTexts.push(metadataText);
        }
        processedBlocks.push(resized.block);
      } else
        processedBlocks.push(block2);
    normalizedInput = processedBlocks, queryCheckpoint("query_image_processing_end");
    let lastBlock = processedBlocks[processedBlocks.length - 1];
    if (lastBlock?.type === "text")
      inputString = lastBlock.text, precedingInputBlocks = processedBlocks.slice(0, -1);
    else
      precedingInputBlocks = processedBlocks;
  }
  if (inputString === null && mode !== "prompt")
    throw Error(`Mode: ${mode} requires a string input.`);
  let imageContents = pastedContents ? Object.values(pastedContents).filter(isValidImagePaste) : [], imagePasteIds = imageContents.map((img) => img.id), storedImagePaths2 = pastedContents ? await storeImages(pastedContents) : /* @__PURE__ */ new Map;
  queryCheckpoint("query_pasted_image_processing_start");
  let imageProcessingResults = await Promise.all(imageContents.map(async (pastedImage) => {
    let imageBlock = {
      type: "image",
      source: {
        type: "base64",
        media_type: pastedImage.mediaType || "image/png",
        data: pastedImage.content
      }
    };
    return logEvent("tengu_pasted_image_resize_attempt", {
      original_size_bytes: pastedImage.content.length
    }), {
      resized: await maybeResizeAndDownsampleImageBlock(imageBlock),
      originalDimensions: pastedImage.dimensions,
      sourcePath: pastedImage.sourcePath ?? storedImagePaths2.get(pastedImage.id)
    };
  })), imageContentBlocks = [];
  for (let {
    resized,
    originalDimensions,
    sourcePath
  } of imageProcessingResults) {
    if (resized.dimensions) {
      let metadataText = createImageMetadataText(resized.dimensions, sourcePath);
      if (metadataText)
        imageMetadataTexts.push(metadataText);
    } else if (originalDimensions) {
      let metadataText = createImageMetadataText(originalDimensions, sourcePath);
      if (metadataText)
        imageMetadataTexts.push(metadataText);
    } else if (sourcePath)
      imageMetadataTexts.push(`[Image source: ${sourcePath}]`);
    imageContentBlocks.push(resized.block);
  }
  queryCheckpoint("query_pasted_image_processing_end");
  let effectiveSkipSlash = skipSlashCommands;
  if (bridgeOrigin && inputString !== null && inputString.startsWith("/")) {
    let parsed = parseSlashCommand(inputString), cmd = parsed ? findCommand(parsed.commandName, context7.options.commands) : void 0;
    if (cmd)
      if (isBridgeSafeCommand(cmd))
        effectiveSkipSlash = !1;
      else {
        let msg = `/${getCommandName(cmd)} isn't available over Remote Control.`;
        return {
          messages: [
            createUserMessage({ content: inputString, uuid: uuid8 }),
            createCommandInputMessage(`<local-command-stdout>${msg}</local-command-stdout>`)
          ],
          shouldQuery: !1,
          resultText: msg
        };
      }
  }
  let shouldExtractAttachments = !skipAttachments && inputString !== null && (mode !== "prompt" || effectiveSkipSlash || !inputString.startsWith("/"));
  queryCheckpoint("query_attachment_loading_start");
  let attachmentMessages = shouldExtractAttachments ? await toArray2(getAttachmentMessages(inputString, context7, ideSelection ?? null, [], messages, querySource)) : [];
  if (queryCheckpoint("query_attachment_loading_end"), inputString !== null && mode === "bash") {
    let { processBashCommand: processBashCommand2 } = await Promise.resolve().then(() => (init_processBashCommand(), exports_processBashCommand));
    return addImageMetadataMessage(await processBashCommand2(inputString, precedingInputBlocks, attachmentMessages, context7, setToolJSX), imageMetadataTexts);
  }
  if (inputString !== null && !effectiveSkipSlash && inputString.startsWith("/")) {
    let { processSlashCommand: processSlashCommand2 } = await Promise.resolve().then(() => (init_processSlashCommand(), exports_processSlashCommand)), slashResult = await processSlashCommand2(inputString, precedingInputBlocks, imageContentBlocks, attachmentMessages, context7, setToolJSX, uuid8, isAlreadyProcessing, canUseTool);
    return addImageMetadataMessage(slashResult, imageMetadataTexts);
  }
  if (inputString !== null && mode === "prompt") {
    let trimmedInput = inputString.trim(), agentMention = attachmentMessages.find((m4) => m4.attachment.type === "agent_mention");
    if (agentMention) {
      let agentMentionString = `@agent-${agentMention.attachment.agentType}`, isSubagentOnly = trimmedInput === agentMentionString, isPrefix = trimmedInput.startsWith(agentMentionString) && !isSubagentOnly;
      logEvent("tengu_subagent_at_mention", {
        is_subagent_only: isSubagentOnly,
        is_prefix: isPrefix
      });
    }
  }
  return addImageMetadataMessage(processTextPrompt(normalizedInput, imageContentBlocks, imagePasteIds, attachmentMessages, uuid8, permissionMode, isMeta), imageMetadataTexts);
}
function addImageMetadataMessage(result, imageMetadataTexts) {
  if (imageMetadataTexts.length > 0)
    result.messages.push(createUserMessage({
      content: imageMetadataTexts.map((text2) => ({ type: "text", text: text2 })),
      isMeta: !0
    }));
  return result;
}
var MAX_HOOK_OUTPUT_LENGTH = 1e4;
var init_processUserInput = __esm(() => {
  init_messages3();
  init_commands5();
  init_attachments2();
  init_generators();
  init_hooks5();
  init_imageResizer();
  init_imageStore();
  init_messages3();
  init_queryProfiler();
  init_keyword();
  init_processTextPrompt();
});

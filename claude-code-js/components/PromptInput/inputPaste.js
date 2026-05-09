// Original: src/components/PromptInput/inputPaste.ts
function maybeTruncateMessageForInput(text2, nextPasteId) {
  if (text2.length <= TRUNCATION_THRESHOLD)
    return {
      truncatedText: text2,
      placeholderContent: ""
    };
  let startLength = Math.floor(PREVIEW_LENGTH / 2), endLength = Math.floor(PREVIEW_LENGTH / 2), startText = text2.slice(0, startLength), endText = text2.slice(-endLength), placeholderContent = text2.slice(startLength, -endLength), truncatedLines = getPastedTextRefNumLines(placeholderContent), placeholderRef = formatTruncatedTextRef(nextPasteId, truncatedLines);
  return {
    truncatedText: startText + placeholderRef + endText,
    placeholderContent
  };
}
function formatTruncatedTextRef(id, numLines) {
  return `[...Truncated text #${id} +${numLines} lines...]`;
}
function maybeTruncateInput(input, pastedContents) {
  let existingIds = Object.keys(pastedContents).map(Number), nextPasteId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1, { truncatedText, placeholderContent } = maybeTruncateMessageForInput(input, nextPasteId);
  if (!placeholderContent)
    return { newInput: input, newPastedContents: pastedContents };
  return {
    newInput: truncatedText,
    newPastedContents: {
      ...pastedContents,
      [nextPasteId]: {
        id: nextPasteId,
        type: "text",
        content: placeholderContent
      }
    }
  };
}
var TRUNCATION_THRESHOLD = 1e4, PREVIEW_LENGTH = 1000;
var init_inputPaste = __esm(() => {
  init_history();
});

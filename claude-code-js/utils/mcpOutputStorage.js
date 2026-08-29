// Original: src/utils/mcpOutputStorage.ts
import { writeFile as writeFile9 } from "fs/promises";
import { join as join55 } from "path";
function getFormatDescription(type, schema5) {
  switch (type) {
    case "toolResult":
      return "Plain text";
    case "structuredContent":
      return schema5 ? `JSON with schema: ${schema5}` : "JSON";
    case "contentArray":
      return schema5 ? `JSON array with schema: ${schema5}` : "JSON array";
  }
}
function getLargeOutputInstructions(rawOutputPath, contentLength, formatDescription, maxReadLength) {
  let baseInstructions = `Error: result (${contentLength.toLocaleString()} characters) exceeds maximum allowed tokens. Output has been saved to ${rawOutputPath}.
Format: ${formatDescription}
Use offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
- You MUST read the content from the file at ${rawOutputPath} in sequential chunks until 100% of the content has been read.
`, truncationWarning = maxReadLength ? `- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${maxReadLength.toLocaleString()} chars.
` : `- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.
`, completionRequirement = `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`;
  return baseInstructions + truncationWarning + `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`;
}
function extensionForMimeType(mimeType) {
  if (!mimeType)
    return "bin";
  switch ((mimeType.split(";")[0] ?? "").trim().toLowerCase()) {
    case "application/pdf":
      return "pdf";
    case "application/json":
      return "json";
    case "text/csv":
      return "csv";
    case "text/plain":
      return "txt";
    case "text/html":
      return "html";
    case "text/markdown":
      return "md";
    case "application/zip":
      return "zip";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "docx";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "xlsx";
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "pptx";
    case "application/msword":
      return "doc";
    case "application/vnd.ms-excel":
      return "xls";
    case "audio/mpeg":
      return "mp3";
    case "audio/wav":
      return "wav";
    case "audio/ogg":
      return "ogg";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}
function isBinaryContentType(contentType) {
  if (!contentType)
    return !1;
  let mt2 = (contentType.split(";")[0] ?? "").trim().toLowerCase();
  if (mt2.startsWith("text/"))
    return !1;
  if (mt2.endsWith("+json") || mt2 === "application/json")
    return !1;
  if (mt2.endsWith("+xml") || mt2 === "application/xml")
    return !1;
  if (mt2.startsWith("application/javascript"))
    return !1;
  if (mt2 === "application/x-www-form-urlencoded")
    return !1;
  return !0;
}
async function persistBinaryContent(bytes, mimeType, persistId) {
  await ensureToolResultsDir();
  let ext = extensionForMimeType(mimeType), filepath = join55(getToolResultsDir(), `${persistId}.${ext}`);
  try {
    await writeFile9(filepath, bytes);
  } catch (error44) {
    let err2 = toError(error44);
    return logError2(err2), { error: err2.message };
  }
  return logEvent("tengu_binary_content_persisted", {
    mimeType: mimeType ?? "unknown",
    sizeBytes: bytes.length,
    ext
  }), { filepath, size: bytes.length, ext };
}
function getBinaryBlobSavedMessage(filepath, mimeType, size, sourceDescription) {
  return `${sourceDescription}Binary content (${mimeType || "unknown type"}, ${formatFileSize(size)}) saved to ${filepath}`;
}
var init_mcpOutputStorage = __esm(() => {
  init_errors();
  init_format();
  init_log3();
  init_toolResultStorage();
});

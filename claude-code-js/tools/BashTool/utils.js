// Original: src/tools/BashTool/utils.ts
import { readFile as readFile26, stat as stat24 } from "fs/promises";
function stripEmptyLines(content) {
  let lines2 = content.split(`
`), startIndex = 0;
  while (startIndex < lines2.length && lines2[startIndex]?.trim() === "")
    startIndex++;
  let endIndex = lines2.length - 1;
  while (endIndex >= 0 && lines2[endIndex]?.trim() === "")
    endIndex--;
  if (startIndex > endIndex)
    return "";
  return lines2.slice(startIndex, endIndex + 1).join(`
`);
}
function isImageOutput(content) {
  return /^data:image\/[a-z0-9.+_-]+;base64,/i.test(content);
}
function parseDataUri(s2) {
  let match = s2.trim().match(DATA_URI_RE);
  if (!match || !match[1] || !match[2])
    return null;
  return { mediaType: match[1], data: match[2] };
}
function buildImageToolResult(stdout, toolUseID) {
  let parsed = parseDataUri(stdout);
  if (!parsed)
    return null;
  return {
    tool_use_id: toolUseID,
    type: "tool_result",
    content: [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: parsed.mediaType,
          data: parsed.data
        }
      }
    ]
  };
}
async function resizeShellImageOutput(stdout, outputFilePath, outputFileSize) {
  let source = stdout;
  if (outputFilePath) {
    if ((outputFileSize ?? (await stat24(outputFilePath)).size) > MAX_IMAGE_FILE_SIZE)
      return null;
    source = await readFile26(outputFilePath, "utf8");
  }
  let parsed = parseDataUri(source);
  if (!parsed)
    return null;
  let buf = Buffer.from(parsed.data, "base64"), ext = parsed.mediaType.split("/")[1] || "png", resized = await maybeResizeAndDownsampleImageBuffer(buf, buf.length, ext);
  return `data:image/${resized.mediaType};base64,${resized.buffer.toString("base64")}`;
}
function formatOutput(content) {
  let isImage = isImageOutput(content);
  if (isImage)
    return {
      totalLines: 1,
      truncatedContent: content,
      isImage
    };
  let maxOutputLength = getMaxOutputLength();
  if (content.length <= maxOutputLength)
    return {
      totalLines: countCharInString(content, `
`) + 1,
      truncatedContent: content,
      isImage
    };
  let truncatedPart = content.slice(0, maxOutputLength), remainingLines = countCharInString(content, `
`, maxOutputLength) + 1, truncated = `${truncatedPart}

... [${remainingLines} lines truncated] ...`;
  return {
    totalLines: countCharInString(content, `
`) + 1,
    truncatedContent: truncated,
    isImage
  };
}
function resetCwdIfOutsideProject(toolPermissionContext) {
  let cwd2 = getCwd(), originalCwd = getOriginalCwd(), shouldMaintain = shouldMaintainProjectWorkingDir();
  if (shouldMaintain || cwd2 !== originalCwd && !pathInAllowedWorkingPath(cwd2, toolPermissionContext)) {
    if (setCwd(originalCwd), !shouldMaintain)
      return logEvent("tengu_bash_tool_reset_to_original_dir", {}), !0;
  }
  return !1;
}
var DATA_URI_RE, MAX_IMAGE_FILE_SIZE = 20971520, stdErrAppendShellResetMessage = (stderr) => `${stderr.trim()}
Shell cwd was reset to ${getOriginalCwd()}`;
var init_utils12 = __esm(() => {
  init_state();
  init_cwd2();
  init_filesystem();
  init_Shell();
  init_envUtils();
  init_imageResizer();
  init_outputLimits();
  DATA_URI_RE = /^data:([^;]+);base64,(.+)$/;
});

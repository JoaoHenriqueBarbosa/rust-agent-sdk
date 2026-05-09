// function: callInner
async function callInner(file_path, fullFilePath, resolvedFilePath, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, context6, messageId) {
  if (ext === "ipynb") {
    let cells = await readNotebook(resolvedFilePath), cellsJson = jsonStringify(cells), cellsJsonBytes = Buffer.byteLength(cellsJson);
    if (cellsJsonBytes > maxSizeBytes)
      throw Error(`Notebook content (${formatFileSize(cellsJsonBytes)}) exceeds maximum allowed size (${formatFileSize(maxSizeBytes)}). Use ${BASH_TOOL_NAME} with jq to read specific portions:
  cat "${file_path}" | jq '.cells[:20]' # First 20 cells
  cat "${file_path}" | jq '.cells[100:120]' # Cells 100-120
  cat "${file_path}" | jq '.cells | length' # Count total cells
  cat "${file_path}" | jq '.cells[] | select(.cell_type=="code") | .source' # All code sources`);
    await validateContentTokens(cellsJson, ext, maxTokens);
    let stats = await getFsImplementation().stat(resolvedFilePath);
    readFileState.set(fullFilePath, {
      content: cellsJson,
      timestamp: Math.floor(stats.mtimeMs),
      offset,
      limit
    }), context6.nestedMemoryAttachmentTriggers?.add(fullFilePath);
    let data2 = {
      type: "notebook",
      file: { filePath: file_path, cells }
    };
    return logFileOperation({
      operation: "read",
      tool: "FileReadTool",
      filePath: fullFilePath,
      content: cellsJson
    }), { data: data2 };
  }
  if (IMAGE_EXTENSIONS.has(ext)) {
    let data2 = await readImageWithTokenBudget(resolvedFilePath, maxTokens);
    context6.nestedMemoryAttachmentTriggers?.add(fullFilePath), logFileOperation({
      operation: "read",
      tool: "FileReadTool",
      filePath: fullFilePath,
      content: data2.file.base64
    });
    let metadataText = data2.file.dimensions ? createImageMetadataText(data2.file.dimensions) : null;
    return {
      data: data2,
      ...metadataText && {
        newMessages: [
          createUserMessage({ content: metadataText, isMeta: !0 })
        ]
      }
    };
  }
  if (isPDFExtension(ext)) {
    if (pages) {
      let parsedRange = parsePDFPageRange(pages), extractResult = await extractPDFPages(resolvedFilePath, parsedRange ?? void 0);
      if (!extractResult.success)
        throw Error(extractResult.error.message);
      logEvent("tengu_pdf_page_extraction", {
        success: !0,
        pageCount: extractResult.data.file.count,
        fileSize: extractResult.data.file.originalSize,
        hasPageRange: !0
      }), logFileOperation({
        operation: "read",
        tool: "FileReadTool",
        filePath: fullFilePath,
        content: `PDF pages ${pages}`
      });
      let imageFiles = (await readdir14(extractResult.data.file.outputDir)).filter((f) => f.endsWith(".jpg")).sort(), imageBlocks = await Promise.all(imageFiles.map(async (f) => {
        let imgPath = path20.join(extractResult.data.file.outputDir, f), imgBuffer = await readFileAsync(imgPath), resized = await maybeResizeAndDownsampleImageBuffer(imgBuffer, imgBuffer.length, "jpeg");
        return {
          type: "image",
          source: {
            type: "base64",
            media_type: `image/${resized.mediaType}`,
            data: resized.buffer.toString("base64")
          }
        };
      }));
      return {
        data: extractResult.data,
        ...imageBlocks.length > 0 && {
          newMessages: [
            createUserMessage({ content: imageBlocks, isMeta: !0 })
          ]
        }
      };
    }
    let pageCount = await getPDFPageCount(resolvedFilePath);
    if (pageCount !== null && pageCount > PDF_AT_MENTION_INLINE_THRESHOLD)
      throw Error(`This PDF has ${pageCount} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). Maximum ${PDF_MAX_PAGES_PER_READ} pages per request.`);
    let stats = await getFsImplementation().stat(resolvedFilePath);
    if (!isPDFSupported() || stats.size > PDF_EXTRACT_SIZE_THRESHOLD) {
      let extractResult = await extractPDFPages(resolvedFilePath);
      if (extractResult.success)
        logEvent("tengu_pdf_page_extraction", {
          success: !0,
          pageCount: extractResult.data.file.count,
          fileSize: extractResult.data.file.originalSize
        });
      else
        logEvent("tengu_pdf_page_extraction", {
          success: !1,
          available: extractResult.error.reason !== "unavailable",
          fileSize: stats.size
        });
    }
    if (!isPDFSupported())
      throw Error(`Reading full PDFs is not supported with this model. Use a newer model (Sonnet 3.5 v2 or later), or use the pages parameter to read specific page ranges (e.g., pages: "1-5", maximum ${PDF_MAX_PAGES_PER_READ} pages per request). Page extraction requires poppler-utils: install with \`brew install poppler\` on macOS or \`apt-get install poppler-utils\` on Debian/Ubuntu.`);
    let readResult = await readPDF(resolvedFilePath);
    if (!readResult.success)
      throw Error(readResult.error.message);
    let pdfData = readResult.data;
    return logFileOperation({
      operation: "read",
      tool: "FileReadTool",
      filePath: fullFilePath,
      content: pdfData.file.base64
    }), {
      data: pdfData,
      newMessages: [
        createUserMessage({
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfData.file.base64
              }
            }
          ],
          isMeta: !0
        })
      ]
    };
  }
  let lineOffset = offset === 0 ? 0 : offset - 1, { content, lineCount, totalLines, totalBytes, readBytes: readBytes2, mtimeMs } = await readFileInRange(resolvedFilePath, lineOffset, limit, limit === void 0 ? maxSizeBytes : void 0, context6.abortController.signal);
  await validateContentTokens(content, ext, maxTokens), readFileState.set(fullFilePath, {
    content,
    timestamp: Math.floor(mtimeMs),
    offset,
    limit
  }), context6.nestedMemoryAttachmentTriggers?.add(fullFilePath);
  for (let listener2 of fileReadListeners.slice())
    listener2(resolvedFilePath, content);
  let data = {
    type: "text",
    file: {
      filePath: file_path,
      content,
      numLines: lineCount,
      startLine: offset,
      totalLines
    }
  };
  if (isAutoMemFile(fullFilePath))
    memoryFileMtimes.set(data, mtimeMs);
  logFileOperation({
    operation: "read",
    tool: "FileReadTool",
    filePath: fullFilePath,
    content
  });
  let sessionFileType = detectSessionFileType2(fullFilePath), analyticsExt = getFileExtensionForAnalytics(fullFilePath);
  return logEvent("tengu_session_file_read", {
    totalLines,
    readLines: lineCount,
    totalBytes,
    readBytes: readBytes2,
    offset,
    ...limit !== void 0 && { limit },
    ...analyticsExt !== void 0 && { ext: analyticsExt },
    ...messageId !== void 0 && {
      messageID: messageId
    },
    is_session_memory: sessionFileType === "session_memory",
    is_session_transcript: sessionFileType === "session_transcript"
  }), { data };
}

// function: persistBlobToTextBlock
async function persistBlobToTextBlock(bytes, mimeType, serverName, sourceDescription) {
  let persistId = `mcp-${normalizeNameForMCP(serverName)}-blob-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, result = await persistBinaryContent(bytes, mimeType, persistId);
  if ("error" in result)
    return [
      {
        type: "text",
        text: `${sourceDescription}Binary content (${mimeType || "unknown type"}, ${bytes.length} bytes) could not be saved to disk: ${result.error}`
      }
    ];
  return [
    {
      type: "text",
      text: getBinaryBlobSavedMessage(result.filepath, mimeType, result.size, sourceDescription)
    }
  ];
}

// function: getNestedMemoryAttachments
async function getNestedMemoryAttachments(toolUseContext) {
  if (!toolUseContext.nestedMemoryAttachmentTriggers || toolUseContext.nestedMemoryAttachmentTriggers.size === 0)
    return [];
  let appState = toolUseContext.getAppState(), attachments = [];
  for (let filePath of toolUseContext.nestedMemoryAttachmentTriggers) {
    let nestedAttachments = await getNestedMemoryAttachmentsForFile(filePath, toolUseContext, appState);
    attachments.push(...nestedAttachments);
  }
  return toolUseContext.nestedMemoryAttachmentTriggers.clear(), attachments;
}

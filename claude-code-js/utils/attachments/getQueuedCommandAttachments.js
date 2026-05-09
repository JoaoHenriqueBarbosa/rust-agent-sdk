// function: getQueuedCommandAttachments
async function getQueuedCommandAttachments(queuedCommands) {
  if (!queuedCommands)
    return [];
  let filtered = queuedCommands.filter((_) => INLINE_NOTIFICATION_MODES.has(_.mode));
  return Promise.all(filtered.map(async (_) => {
    let imageBlocks = await buildImageContentBlocks(_.pastedContents), prompt = _.value;
    if (imageBlocks.length > 0)
      prompt = [{ type: "text", text: typeof _.value === "string" ? _.value : extractTextContent(_.value, `
`) }, ...imageBlocks];
    return {
      type: "queued_command",
      prompt,
      source_uuid: _.uuid,
      imagePasteIds: getImagePasteIds(_.pastedContents),
      commandMode: _.mode,
      origin: _.origin,
      isMeta: _.isMeta
    };
  }));
}

// function: normalizeMessages
function normalizeMessages(messages) {
  let isNewChain = !1;
  return messages.flatMap((message) => {
    switch (message.type) {
      case "assistant":
        return isNewChain = isNewChain || message.message.content.length > 1, message.message.content.map((_, index) => {
          let uuid8 = isNewChain ? deriveUUID(message.uuid, index) : message.uuid;
          return {
            type: "assistant",
            timestamp: message.timestamp,
            message: {
              ...message.message,
              content: [_],
              context_management: message.message.context_management ?? null
            },
            isMeta: message.isMeta,
            isVirtual: message.isVirtual,
            requestId: message.requestId,
            uuid: uuid8,
            error: message.error,
            isApiErrorMessage: message.isApiErrorMessage,
            advisorModel: message.advisorModel
          };
        });
      case "attachment":
        return [message];
      case "progress":
        return [message];
      case "system":
        return [message];
      case "user": {
        if (typeof message.message.content === "string") {
          let uuid8 = isNewChain ? deriveUUID(message.uuid, 0) : message.uuid;
          return [
            {
              ...message,
              uuid: uuid8,
              message: {
                ...message.message,
                content: [{ type: "text", text: message.message.content }]
              }
            }
          ];
        }
        isNewChain = isNewChain || message.message.content.length > 1;
        let imageIndex = 0;
        return message.message.content.map((_, index) => {
          let isImage = _.type === "image", imageId = isImage && message.imagePasteIds ? message.imagePasteIds[imageIndex] : void 0;
          if (isImage)
            imageIndex++;
          return {
            ...createUserMessage({
              content: [_],
              toolUseResult: message.toolUseResult,
              mcpMeta: message.mcpMeta,
              isMeta: message.isMeta,
              isVisibleInTranscriptOnly: message.isVisibleInTranscriptOnly,
              isVirtual: message.isVirtual,
              timestamp: message.timestamp,
              imagePasteIds: imageId !== void 0 ? [imageId] : void 0,
              origin: message.origin
            }),
            uuid: isNewChain ? deriveUUID(message.uuid, index) : message.uuid
          };
        });
      }
    }
  });
}

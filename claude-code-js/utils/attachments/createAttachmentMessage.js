// function: createAttachmentMessage
function createAttachmentMessage(attachment) {
  return {
    attachment,
    type: "attachment",
    uuid: randomUUID21(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
}

// function: getInitialPasteId
function getInitialPasteId(messages) {
  let maxId = 0;
  for (let message of messages)
    if (message.type === "user") {
      if (message.imagePasteIds) {
        for (let id of message.imagePasteIds)
          if (id > maxId)
            maxId = id;
      }
      if (Array.isArray(message.message.content)) {
        for (let block2 of message.message.content)
          if (block2.type === "text") {
            let refs3 = parseReferences(block2.text);
            for (let ref of refs3)
              if (ref.id > maxId)
                maxId = ref.id;
          }
      }
    }
  return maxId + 1;
}

// function: getNextImagePasteId
function getNextImagePasteId(messages) {
  let maxId = 0;
  for (let message of messages)
    if (message.type === "user" && message.imagePasteIds) {
      for (let id of message.imagePasteIds)
        if (id > maxId)
          maxId = id;
    }
  return maxId + 1;
}

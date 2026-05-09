// function: getChunkedStream2
function getChunkedStream2(source) {
  let currentMessageTotalLength = 0, currentMessagePendingLength = 0, currentMessage = null, messageLengthBuffer = null, allocateMessage = (size) => {
    if (typeof size !== "number")
      throw Error("Attempted to allocate an event message where size was not a number: " + size);
    currentMessageTotalLength = size, currentMessagePendingLength = 4, currentMessage = new Uint8Array(size), new DataView(currentMessage.buffer).setUint32(0, size, !1);
  }, iterator2 = async function* () {
    let sourceIterator = source[Symbol.asyncIterator]();
    while (!0) {
      let { value, done } = await sourceIterator.next();
      if (done) {
        if (!currentMessageTotalLength)
          return;
        else if (currentMessageTotalLength === currentMessagePendingLength)
          yield currentMessage;
        else
          throw Error("Truncated event message received.");
        return;
      }
      let chunkLength = value.length, currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!currentMessage) {
          let bytesRemaining = chunkLength - currentOffset;
          if (!messageLengthBuffer)
            messageLengthBuffer = new Uint8Array(4);
          let numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
          if (messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength), currentMessagePendingLength += numBytesForTotal, currentOffset += numBytesForTotal, currentMessagePendingLength < 4)
            break;
          allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, !1)), messageLengthBuffer = null;
        }
        let numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
        if (currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength), currentMessagePendingLength += numBytesToWrite, currentOffset += numBytesToWrite, currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength)
          yield currentMessage, currentMessage = null, currentMessageTotalLength = 0, currentMessagePendingLength = 0;
      }
    }
  };
  return {
    [Symbol.asyncIterator]: iterator2
  };
}

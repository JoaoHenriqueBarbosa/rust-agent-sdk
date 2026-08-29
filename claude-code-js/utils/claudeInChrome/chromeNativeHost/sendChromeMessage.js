// function: sendChromeMessage
function sendChromeMessage(message) {
  let jsonBytes = Buffer.from(message, "utf-8"), lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32LE(jsonBytes.length, 0), process.stdout.write(lengthBuffer), process.stdout.write(jsonBytes);
}

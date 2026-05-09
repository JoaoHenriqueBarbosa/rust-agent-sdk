// function: getIdGenerator
function getIdGenerator(bytes) {
  return function() {
    for (let i5 = 0;i5 < bytes / 4; i5++)
      SHARED_BUFFER.writeUInt32BE(Math.random() * 4294967296 >>> 0, i5 * 4);
    for (let i5 = 0;i5 < bytes; i5++)
      if (SHARED_BUFFER[i5] > 0)
        break;
      else if (i5 === bytes - 1)
        SHARED_BUFFER[bytes - 1] = 1;
    return SHARED_BUFFER.toString("hex", 0, bytes);
  };
}

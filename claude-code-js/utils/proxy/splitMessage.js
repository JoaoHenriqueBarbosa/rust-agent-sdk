// function: splitMessage
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH)
    throw Error("Provided message too short to accommodate event stream message overhead");
  let view = new DataView(buffer, byteOffset, byteLength), messageLength = view.getUint32(0, !1);
  if (byteLength !== messageLength)
    throw Error("Reported message length does not match received message length");
  let headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, !1), expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, !1), expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, !1), checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest())
    throw Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  if (checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH))), expectedMessageChecksum !== checksummer.digest())
    throw Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}

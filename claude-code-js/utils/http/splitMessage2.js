// function: splitMessage2
function splitMessage2({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH2)
    throw Error("Provided message too short to accommodate event stream message overhead");
  let view = new DataView(buffer, byteOffset, byteLength), messageLength = view.getUint32(0, !1);
  if (byteLength !== messageLength)
    throw Error("Reported message length does not match received message length");
  let headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH2, !1), expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH2, !1), expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH2, !1), checksummer = new import_crc323.Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH2));
  if (expectedPreludeChecksum !== checksummer.digest())
    throw Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  if (checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH2, byteLength - (PRELUDE_LENGTH2 + CHECKSUM_LENGTH2))), expectedMessageChecksum !== checksummer.digest())
    throw Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH2 + CHECKSUM_LENGTH2, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH2 + CHECKSUM_LENGTH2 + headerLength, messageLength - headerLength - (PRELUDE_LENGTH2 + CHECKSUM_LENGTH2 + CHECKSUM_LENGTH2))
  };
}

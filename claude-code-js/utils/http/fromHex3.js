// function: fromHex3
function fromHex3(encoded) {
  if (encoded.length % 2 !== 0)
    throw Error("Hex encoded strings must have an even number length");
  let out = new Uint8Array(encoded.length / 2);
  for (let i4 = 0;i4 < encoded.length; i4 += 2) {
    let encodedByte = encoded.slice(i4, i4 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT3)
      out[i4 / 2] = HEX_TO_SHORT3[encodedByte];
    else
      throw Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
  }
  return out;
}

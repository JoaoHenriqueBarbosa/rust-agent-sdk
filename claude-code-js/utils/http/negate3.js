// function: negate3
function negate3(bytes) {
  for (let i4 = 0;i4 < 8; i4++)
    bytes[i4] ^= 255;
  for (let i4 = 7;i4 > -1; i4--)
    if (bytes[i4]++, bytes[i4] !== 0)
      break;
}

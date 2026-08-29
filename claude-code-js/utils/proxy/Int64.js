// class: Int64
class Int64 {
  bytes;
  constructor(bytes) {
    if (this.bytes = bytes, bytes.byteLength !== 8)
      throw Error("Int64 buffers must be exactly 8 bytes");
  }
  static fromNumber(number4) {
    if (number4 > 9223372036854776000 || number4 < -9223372036854776000)
      throw Error(`${number4} is too large (or, if negative, too small) to represent as an Int64`);
    let bytes = new Uint8Array(8);
    for (let i3 = 7, remaining = Math.abs(Math.round(number4));i3 > -1 && remaining > 0; i3--, remaining /= 256)
      bytes[i3] = remaining;
    if (number4 < 0)
      negate(bytes);
    return new Int64(bytes);
  }
  valueOf() {
    let bytes = this.bytes.slice(0), negative = bytes[0] & 128;
    if (negative)
      negate(bytes);
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
}

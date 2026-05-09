// class: HeaderMarshaller3
class HeaderMarshaller3 {
  constructor(toUtf86, fromUtf812) {
    this.toUtf8 = toUtf86, this.fromUtf8 = fromUtf812;
  }
  format(headers) {
    let chunks = [];
    for (let headerName of Object.keys(headers)) {
      let bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    let out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0)), position = 0;
    for (let chunk of chunks)
      out.set(chunk, position), position += chunk.byteLength;
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        let shortView = new DataView(new ArrayBuffer(3));
        return shortView.setUint8(0, 3), shortView.setInt16(1, header.value, !1), new Uint8Array(shortView.buffer);
      case "integer":
        let intView = new DataView(new ArrayBuffer(5));
        return intView.setUint8(0, 4), intView.setInt32(1, header.value, !1), new Uint8Array(intView.buffer);
      case "long":
        let longBytes = new Uint8Array(9);
        return longBytes[0] = 5, longBytes.set(header.value.bytes, 1), longBytes;
      case "binary":
        let binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6), binView.setUint16(1, header.value.byteLength, !1);
        let binBytes = new Uint8Array(binView.buffer);
        return binBytes.set(header.value, 3), binBytes;
      case "string":
        let utf8Bytes = this.fromUtf8(header.value), strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7), strView.setUint16(1, utf8Bytes.byteLength, !1);
        let strBytes = new Uint8Array(strView.buffer);
        return strBytes.set(utf8Bytes, 3), strBytes;
      case "timestamp":
        let tsBytes = new Uint8Array(9);
        return tsBytes[0] = 8, tsBytes.set(Int644.fromNumber(header.value.valueOf()).bytes, 1), tsBytes;
      case "uuid":
        if (!UUID_PATTERN3.test(header.value))
          throw Error(`Invalid UUID received: ${header.value}`);
        let uuidBytes = new Uint8Array(17);
        return uuidBytes[0] = 9, uuidBytes.set(fromHex3(header.value.replace(/\-/g, "")), 1), uuidBytes;
    }
  }
  parse(headers) {
    let out = {}, position = 0;
    while (position < headers.byteLength) {
      let nameLength = headers.getUint8(position++), name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      switch (position += nameLength, headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG2,
            value: !0
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG2,
            value: !1
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG2,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG2,
            value: headers.getInt16(position, !1)
          }, position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG2,
            value: headers.getInt32(position, !1)
          }, position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG2,
            value: new Int644(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          }, position += 8;
          break;
        case 6:
          let binaryLength = headers.getUint16(position, !1);
          position += 2, out[name] = {
            type: BINARY_TAG2,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          }, position += binaryLength;
          break;
        case 7:
          let stringLength = headers.getUint16(position, !1);
          position += 2, out[name] = {
            type: STRING_TAG2,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          }, position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG2,
            value: new Date(new Int644(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          }, position += 8;
          break;
        case 9:
          let uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16, out[name] = {
            type: UUID_TAG2,
            value: `${toHex3(uuidBytes.subarray(0, 4))}-${toHex3(uuidBytes.subarray(4, 6))}-${toHex3(uuidBytes.subarray(6, 8))}-${toHex3(uuidBytes.subarray(8, 10))}-${toHex3(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw Error("Unrecognized header type tag");
      }
    }
    return out;
  }
}

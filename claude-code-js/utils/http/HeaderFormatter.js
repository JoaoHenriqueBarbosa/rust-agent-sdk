// class: HeaderFormatter
class HeaderFormatter {
  format(headers) {
    let chunks = [];
    for (let headerName of Object.keys(headers)) {
      let bytes = fromUtf810(headerName);
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
        let utf8Bytes = fromUtf810(header.value), strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7), strView.setUint16(1, utf8Bytes.byteLength, !1);
        let strBytes = new Uint8Array(strView.buffer);
        return strBytes.set(utf8Bytes, 3), strBytes;
      case "timestamp":
        let tsBytes = new Uint8Array(9);
        return tsBytes[0] = 8, tsBytes.set(Int643.fromNumber(header.value.valueOf()).bytes, 1), tsBytes;
      case "uuid":
        if (!UUID_PATTERN2.test(header.value))
          throw Error(`Invalid UUID received: ${header.value}`);
        let uuidBytes = new Uint8Array(17);
        return uuidBytes[0] = 9, uuidBytes.set(fromHex2(header.value.replace(/\-/g, "")), 1), uuidBytes;
    }
  }
}

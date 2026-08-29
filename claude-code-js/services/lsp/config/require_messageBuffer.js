// var: require_messageBuffer
var require_messageBuffer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AbstractMessageBuffer = void 0;
  var CR2 = 13, LF3 = 10, CRLF2 = `\r
`;

  class AbstractMessageBuffer {
    constructor(encoding = "utf-8") {
      this._encoding = encoding, this._chunks = [], this._totalLength = 0;
    }
    get encoding() {
      return this._encoding;
    }
    append(chunk) {
      let toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
      this._chunks.push(toAppend), this._totalLength += toAppend.byteLength;
    }
    tryReadHeaders(lowerCaseKeys = !1) {
      if (this._chunks.length === 0)
        return;
      let state3 = 0, chunkIndex = 0, offset = 0, chunkBytesRead = 0;
      row:
        while (chunkIndex < this._chunks.length) {
          let chunk = this._chunks[chunkIndex];
          offset = 0;
          column:
            while (offset < chunk.length) {
              switch (chunk[offset]) {
                case CR2:
                  switch (state3) {
                    case 0:
                      state3 = 1;
                      break;
                    case 2:
                      state3 = 3;
                      break;
                    default:
                      state3 = 0;
                  }
                  break;
                case LF3:
                  switch (state3) {
                    case 1:
                      state3 = 2;
                      break;
                    case 3:
                      state3 = 4, offset++;
                      break row;
                    default:
                      state3 = 0;
                  }
                  break;
                default:
                  state3 = 0;
              }
              offset++;
            }
          chunkBytesRead += chunk.byteLength, chunkIndex++;
        }
      if (state3 !== 4)
        return;
      let buffer = this._read(chunkBytesRead + offset), result = /* @__PURE__ */ new Map, headers = this.toString(buffer, "ascii").split(CRLF2);
      if (headers.length < 2)
        return result;
      for (let i5 = 0;i5 < headers.length - 2; i5++) {
        let header = headers[i5], index = header.indexOf(":");
        if (index === -1)
          throw Error(`Message header must separate key and value using ':'
${header}`);
        let key2 = header.substr(0, index), value = header.substr(index + 1).trim();
        result.set(lowerCaseKeys ? key2.toLowerCase() : key2, value);
      }
      return result;
    }
    tryReadBody(length) {
      if (this._totalLength < length)
        return;
      return this._read(length);
    }
    get numberOfBytes() {
      return this._totalLength;
    }
    _read(byteCount) {
      if (byteCount === 0)
        return this.emptyBuffer();
      if (byteCount > this._totalLength)
        throw Error("Cannot read so many bytes!");
      if (this._chunks[0].byteLength === byteCount) {
        let chunk = this._chunks[0];
        return this._chunks.shift(), this._totalLength -= byteCount, this.asNative(chunk);
      }
      if (this._chunks[0].byteLength > byteCount) {
        let chunk = this._chunks[0], result2 = this.asNative(chunk, byteCount);
        return this._chunks[0] = chunk.slice(byteCount), this._totalLength -= byteCount, result2;
      }
      let result = this.allocNative(byteCount), resultOffset = 0, chunkIndex = 0;
      while (byteCount > 0) {
        let chunk = this._chunks[chunkIndex];
        if (chunk.byteLength > byteCount) {
          let chunkPart = chunk.slice(0, byteCount);
          result.set(chunkPart, resultOffset), resultOffset += byteCount, this._chunks[chunkIndex] = chunk.slice(byteCount), this._totalLength -= byteCount, byteCount -= byteCount;
        } else
          result.set(chunk, resultOffset), resultOffset += chunk.byteLength, this._chunks.shift(), this._totalLength -= chunk.byteLength, byteCount -= chunk.byteLength;
      }
      return result;
    }
  }
  exports.AbstractMessageBuffer = AbstractMessageBuffer;
});

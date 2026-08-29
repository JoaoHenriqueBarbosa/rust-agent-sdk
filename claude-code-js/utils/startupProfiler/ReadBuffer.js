// class: ReadBuffer
class ReadBuffer {
  append(chunk) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
  }
  readMessage() {
    if (!this._buffer)
      return null;
    let index = this._buffer.indexOf(`
`);
    if (index === -1)
      return null;
    let line = this._buffer.toString("utf8", 0, index).replace(/\r$/, "");
    return this._buffer = this._buffer.subarray(index + 1), deserializeMessage(line);
  }
  clear() {
    this._buffer = void 0;
  }
}

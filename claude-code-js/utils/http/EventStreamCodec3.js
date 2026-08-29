// class: EventStreamCodec3
class EventStreamCodec3 {
  constructor(toUtf86, fromUtf812) {
    this.headerMarshaller = new HeaderMarshaller3(toUtf86, fromUtf812), this.messageBuffer = [], this.isEndOfStream = !1;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = !0;
  }
  getMessage() {
    let message = this.messageBuffer.pop(), isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    let messages = this.messageBuffer;
    this.messageBuffer = [];
    let isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    let headers = this.headerMarshaller.format(rawHeaders), length = headers.byteLength + body.byteLength + 16, out = new Uint8Array(length), view = new DataView(out.buffer, out.byteOffset, out.byteLength), checksum7 = new import_crc324.Crc32;
    return view.setUint32(0, length, !1), view.setUint32(4, headers.byteLength, !1), view.setUint32(8, checksum7.update(out.subarray(0, 8)).digest(), !1), out.set(headers, 12), out.set(body, headers.byteLength + 12), view.setUint32(length - 4, checksum7.update(out.subarray(8, length - 4)).digest(), !1), out;
  }
  decode(message) {
    let { headers, body } = splitMessage2(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
}

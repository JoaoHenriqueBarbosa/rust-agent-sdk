// class: SSEDecoder
class SSEDecoder {
  constructor() {
    this.event = null, this.data = [], this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r"))
      line = line.substring(0, line.length - 1);
    if (!line) {
      if (!this.event && !this.data.length)
        return null;
      let sse = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], sse;
    }
    if (this.chunks.push(line), line.startsWith(":"))
      return null;
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" "))
      value = value.substring(1);
    if (fieldname === "event")
      this.event = value;
    else if (fieldname === "data")
      this.data.push(value);
    return null;
  }
}

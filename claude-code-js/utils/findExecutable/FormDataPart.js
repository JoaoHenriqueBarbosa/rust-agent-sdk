// class: FormDataPart
class FormDataPart {
  constructor(name, value) {
    let { escapeName } = this.constructor, isStringValue = utils_default.isString(value), headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
    if (isStringValue)
      value = textEncoder3.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    else
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    this.headers = textEncoder3.encode(headers + CRLF), this.contentLength = isStringValue ? value.byteLength : value.size, this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT, this.name = name, this.value = value;
  }
  async* encode() {
    yield this.headers;
    let { value } = this;
    if (utils_default.isTypedArray(value))
      yield value;
    else
      yield* readBlob_default(value);
    yield CRLF_BYTES;
  }
  static escapeName(name) {
    return String(name).replace(/[\r\n"]/g, (match) => ({
      "\r": "%0D",
      "\n": "%0A",
      '"': "%22"
    })[match]);
  }
}

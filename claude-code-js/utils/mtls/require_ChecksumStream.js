// var: require_ChecksumStream
var require_ChecksumStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ChecksumStream = void 0;
  var util_base64_1 = require_dist_cjs18(), stream_1 = __require("stream");

  class ChecksumStream extends stream_1.Duplex {
    expectedChecksum;
    checksumSourceLocation;
    checksum;
    source;
    base64Encoder;
    pendingCallback = null;
    constructor({ expectedChecksum, checksum: checksum2, source, checksumSourceLocation, base64Encoder }) {
      super();
      if (typeof source.pipe === "function")
        this.source = source;
      else
        throw Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
      this.base64Encoder = base64Encoder ?? util_base64_1.toBase64, this.expectedChecksum = expectedChecksum, this.checksum = checksum2, this.checksumSourceLocation = checksumSourceLocation, this.source.pipe(this);
    }
    _read(size) {
      if (this.pendingCallback) {
        let callback = this.pendingCallback;
        this.pendingCallback = null, callback();
      }
    }
    _write(chunk, encoding, callback) {
      try {
        if (this.checksum.update(chunk), !this.push(chunk)) {
          this.pendingCallback = callback;
          return;
        }
      } catch (e) {
        return callback(e);
      }
      return callback();
    }
    async _final(callback) {
      try {
        let digest = await this.checksum.digest(), received = this.base64Encoder(digest);
        if (this.expectedChecksum !== received)
          return callback(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${received}" in response header "${this.checksumSourceLocation}".`));
      } catch (e) {
        return callback(e);
      }
      return this.push(null), callback();
    }
  }
  exports.ChecksumStream = ChecksumStream;
});

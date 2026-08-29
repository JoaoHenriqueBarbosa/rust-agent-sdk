// var: require_createChecksumStream_browser
var require_createChecksumStream_browser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createChecksumStream = void 0;
  var util_base64_1 = require_dist_cjs18(), stream_type_check_1 = require_stream_type_check(), ChecksumStream_browser_1 = require_ChecksumStream_browser(), createChecksumStream = ({ expectedChecksum, checksum: checksum2, source, checksumSourceLocation, base64Encoder }) => {
    if (!(0, stream_type_check_1.isReadableStream)(source))
      throw Error(`@smithy/util-stream: unsupported source type ${source?.constructor?.name ?? source} in ChecksumStream.`);
    let encoder = base64Encoder ?? util_base64_1.toBase64;
    if (typeof TransformStream !== "function")
      throw Error("@smithy/util-stream: unable to instantiate ChecksumStream because API unavailable: ReadableStream/TransformStream.");
    let transform2 = new TransformStream({
      start() {},
      async transform(chunk, controller) {
        checksum2.update(chunk), controller.enqueue(chunk);
      },
      async flush(controller) {
        let digest = await checksum2.digest(), received = encoder(digest);
        if (expectedChecksum !== received) {
          let error41 = Error(`Checksum mismatch: expected "${expectedChecksum}" but received "${received}" in response header "${checksumSourceLocation}".`);
          controller.error(error41);
        } else
          controller.terminate();
      }
    });
    source.pipeThrough(transform2);
    let readable2 = transform2.readable;
    return Object.setPrototypeOf(readable2, ChecksumStream_browser_1.ChecksumStream.prototype), readable2;
  };
  exports.createChecksumStream = createChecksumStream;
});

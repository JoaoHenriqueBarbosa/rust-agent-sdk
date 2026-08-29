// var: require_getAwsChunkedEncodingStream_browser
var require_getAwsChunkedEncodingStream_browser = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getAwsChunkedEncodingStream = void 0;
  var getAwsChunkedEncodingStream = (readableStream, options) => {
    let { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options, checksumRequired = base64Encoder !== void 0 && bodyLengthChecker !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0, digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0, reader = readableStream.getReader();
    return new ReadableStream({
      async pull(controller) {
        let { value, done } = await reader.read();
        if (done) {
          if (controller.enqueue(`0\r
`), checksumRequired) {
            let checksum2 = base64Encoder(await digest);
            controller.enqueue(`${checksumLocationName}:${checksum2}\r
`), controller.enqueue(`\r
`);
          }
          controller.close();
        } else
          controller.enqueue(`${(bodyLengthChecker(value) || 0).toString(16)}\r
${value}\r
`);
      }
    });
  };
  exports.getAwsChunkedEncodingStream = getAwsChunkedEncodingStream;
});

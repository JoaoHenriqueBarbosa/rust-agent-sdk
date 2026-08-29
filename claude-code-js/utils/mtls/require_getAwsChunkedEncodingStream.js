// var: require_getAwsChunkedEncodingStream
var require_getAwsChunkedEncodingStream = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getAwsChunkedEncodingStream = getAwsChunkedEncodingStream;
  var node_stream_1 = __require("stream"), getAwsChunkedEncodingStream_browser_1 = require_getAwsChunkedEncodingStream_browser(), stream_type_check_1 = require_stream_type_check();
  function getAwsChunkedEncodingStream(stream5, options) {
    let readable2 = stream5, readableStream = stream5;
    if ((0, stream_type_check_1.isReadableStream)(readableStream))
      return (0, getAwsChunkedEncodingStream_browser_1.getAwsChunkedEncodingStream)(readableStream, options);
    let { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options, checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0, digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readable2) : void 0, awsChunkedEncodingStream = new node_stream_1.Readable({
      read: () => {}
    });
    return readable2.on("data", (data) => {
      let length = bodyLengthChecker(data) || 0;
      if (length === 0)
        return;
      awsChunkedEncodingStream.push(`${length.toString(16)}\r
`), awsChunkedEncodingStream.push(data), awsChunkedEncodingStream.push(`\r
`);
    }), readable2.on("end", async () => {
      if (awsChunkedEncodingStream.push(`0\r
`), checksumRequired) {
        let checksum2 = base64Encoder(await digest);
        awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum2}\r
`), awsChunkedEncodingStream.push(`\r
`);
      }
      awsChunkedEncodingStream.push(null);
    }), awsChunkedEncodingStream;
  }
});

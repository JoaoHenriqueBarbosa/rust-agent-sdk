// var: throwDefaultError3
var throwDefaultError3 = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  let $metadata = deserializeMetadata3(output), statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0, response4 = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException3(response4, parsedBody);
}, withBaseException3 = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError3({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
}, deserializeMetadata3 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});

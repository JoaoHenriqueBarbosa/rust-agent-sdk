// var: throwDefaultError4
var throwDefaultError4 = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  let $metadata = deserializeMetadata4(output), statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0, response5 = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException4(response5, parsedBody);
}, withBaseException4 = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError4({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
}, deserializeMetadata4 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});

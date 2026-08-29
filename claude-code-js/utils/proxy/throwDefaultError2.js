// var: throwDefaultError2
var throwDefaultError2 = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  let $metadata = deserializeMetadata2(output), statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0, response3 = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException2(response3, parsedBody);
}, withBaseException2 = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError2({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
}, deserializeMetadata2 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});

// var: de_InternalServerExceptionRes
var de_InternalServerExceptionRes = async (parsedOutput, context) => {
  let contents = map6({}), data = parsedOutput.body, doc2 = take5(data, {
    message: expectString
  });
  Object.assign(contents, doc2);
  let exception = new InternalServerException2({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException5(exception, parsedOutput.body);
}, de_ModelStreamErrorExceptionRes = async (parsedOutput, context) => {
  let contents = map6({}), data = parsedOutput.body, doc2 = take5(data, {
    message: expectString,
    originalMessage: expectString,
    originalStatusCode: expectInt32
  });
  Object.assign(contents, doc2);
  let exception = new ModelStreamErrorException({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException5(exception, parsedOutput.body);
}, de_ThrottlingExceptionRes = async (parsedOutput, context) => {
  let contents = map6({}), data = parsedOutput.body, doc2 = take5(data, {
    message: expectString
  });
  Object.assign(contents, doc2);
  let exception = new ThrottlingException2({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException5(exception, parsedOutput.body);
}, de_ValidationExceptionRes = async (parsedOutput, context) => {
  let contents = map6({}), data = parsedOutput.body, doc2 = take5(data, {
    message: expectString
  });
  Object.assign(contents, doc2);
  let exception = new ValidationException2({
    $metadata: deserializeMetadata5(parsedOutput),
    ...contents
  });
  return decorateServiceException5(exception, parsedOutput.body);
}, de_ResponseStream = (output, context) => {
  return context.eventStreamMarshaller.deserialize(output, async (event) => {
    if (event.chunk != null)
      return {
        chunk: await de_PayloadPart_event(event.chunk, context)
      };
    if (event.internalServerException != null)
      return {
        internalServerException: await de_InternalServerException_event(event.internalServerException, context)
      };
    if (event.modelStreamErrorException != null)
      return {
        modelStreamErrorException: await de_ModelStreamErrorException_event(event.modelStreamErrorException, context)
      };
    if (event.validationException != null)
      return {
        validationException: await de_ValidationException_event(event.validationException, context)
      };
    if (event.throttlingException != null)
      return {
        throttlingException: await de_ThrottlingException_event(event.throttlingException, context)
      };
    return { $unknown: output };
  });
}, de_InternalServerException_event = async (output, context) => {
  let parsedOutput = {
    ...output,
    body: await parseBody(output.body, context)
  };
  return de_InternalServerExceptionRes(parsedOutput, context);
}, de_ModelStreamErrorException_event = async (output, context) => {
  let parsedOutput = {
    ...output,
    body: await parseBody(output.body, context)
  };
  return de_ModelStreamErrorExceptionRes(parsedOutput, context);
}, de_PayloadPart_event = async (output, context) => {
  let contents = {}, data = await parseBody(output.body, context);
  return Object.assign(contents, de_PayloadPart(data, context)), contents;
}, de_ThrottlingException_event = async (output, context) => {
  let parsedOutput = {
    ...output,
    body: await parseBody(output.body, context)
  };
  return de_ThrottlingExceptionRes(parsedOutput, context);
}, de_ValidationException_event = async (output, context) => {
  let parsedOutput = {
    ...output,
    body: await parseBody(output.body, context)
  };
  return de_ValidationExceptionRes(parsedOutput, context);
}, de_PayloadPart = (output, context) => {
  return take5(output, {
    bytes: context.base64Decoder
  });
}, deserializeMetadata5 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"] ?? "",
  extendedRequestId: output.headers["x-amz-id-2"] ?? "",
  cfId: output.headers["x-amz-cf-id"] ?? ""
}), collectBodyString = (streamBody, context) => collectBody5(streamBody, context).then((body) => context.utf8Encoder(body)), parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length)
    return JSON.parse(encoded);
  return {};
});

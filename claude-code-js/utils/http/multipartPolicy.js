// function: multipartPolicy
function multipartPolicy() {
  return {
    name: multipartPolicyName,
    async sendRequest(request2, next) {
      if (!request2.multipartBody)
        return next(request2);
      if (request2.body)
        throw Error("multipartBody and regular body cannot be set at the same time");
      let boundary = request2.multipartBody.boundary, contentTypeHeader = request2.headers.get("Content-Type") ?? "multipart/mixed", parsedHeader = contentTypeHeader.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
      if (!parsedHeader)
        throw Error(`Got multipart request body, but content-type header was not multipart: ${contentTypeHeader}`);
      let [, contentType, parsedBoundary] = parsedHeader;
      if (parsedBoundary && boundary && parsedBoundary !== boundary)
        throw Error(`Multipart boundary was specified as ${parsedBoundary} in the header, but got ${boundary} in the request body`);
      if (boundary ??= parsedBoundary, boundary)
        assertValidBoundary(boundary);
      else
        boundary = generateBoundary();
      return request2.headers.set("Content-Type", `${contentType}; boundary=${boundary}`), await buildRequestBody(request2, request2.multipartBody.parts, boundary), request2.multipartBody = void 0, next(request2);
    }
  };
}

// var: prepareRequest
var prepareRequest = (request2) => {
  request2 = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (let headerName of Object.keys(request2.headers))
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1)
      delete request2.headers[headerName];
  return request2;
};

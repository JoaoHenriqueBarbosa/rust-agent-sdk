// var: moveHeadersToQuery
var moveHeadersToQuery = (request2, options = {}) => {
  let { headers, query = {} } = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (let name of Object.keys(headers)) {
    let lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname))
      query[name] = headers[name], delete headers[name];
  }
  return {
    ...request2,
    headers,
    query
  };
};

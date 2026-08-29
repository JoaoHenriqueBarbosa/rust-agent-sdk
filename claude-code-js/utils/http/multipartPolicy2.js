// function: multipartPolicy2
function multipartPolicy2() {
  let tspPolicy = multipartPolicy();
  return {
    name: multipartPolicyName2,
    sendRequest: async (request2, next) => {
      if (request2.multipartBody) {
        for (let part of request2.multipartBody.parts)
          if (hasRawContent(part.body))
            part.body = getRawContent(part.body);
      }
      return tspPolicy.sendRequest(request2, next);
    }
  };
}

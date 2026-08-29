// function: parse9
async function parse9(jsonContentTypes, xmlContentTypes, operationResponse, opts, parseXML) {
  if (!operationResponse.request.streamResponseStatusCodes?.has(operationResponse.status) && operationResponse.bodyAsText) {
    let text = operationResponse.bodyAsText, contentType = operationResponse.headers.get("Content-Type") || "", contentComponents = !contentType ? [] : contentType.split(";").map((component) => component.toLowerCase());
    try {
      if (contentComponents.length === 0 || contentComponents.some((component) => jsonContentTypes.indexOf(component) !== -1))
        return operationResponse.parsedBody = JSON.parse(text), operationResponse;
      else if (contentComponents.some((component) => xmlContentTypes.indexOf(component) !== -1)) {
        if (!parseXML)
          throw Error("Parsing XML not supported.");
        let body = await parseXML(text, opts.xml);
        return operationResponse.parsedBody = body, operationResponse;
      }
    } catch (err) {
      let msg = `Error "${err}" occurred while parsing the response body - ${operationResponse.bodyAsText}.`, errCode = err.code || RestError2.PARSE_ERROR;
      throw new RestError2(msg, {
        code: errCode,
        statusCode: operationResponse.status,
        request: operationResponse.request,
        response: operationResponse
      });
    }
  }
  return operationResponse;
}

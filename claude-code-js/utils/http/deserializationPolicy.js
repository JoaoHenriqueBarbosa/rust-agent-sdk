// function: deserializationPolicy
function deserializationPolicy(options = {}) {
  let jsonContentTypes = options.expectedContentTypes?.json ?? defaultJsonContentTypes, xmlContentTypes = options.expectedContentTypes?.xml ?? defaultXmlContentTypes, parseXML = options.parseXML, serializerOptions = options.serializerOptions, updatedOptions = {
    xml: {
      rootName: serializerOptions?.xml.rootName ?? "",
      includeRoot: serializerOptions?.xml.includeRoot ?? !1,
      xmlCharKey: serializerOptions?.xml.xmlCharKey ?? XML_CHARKEY
    }
  };
  return {
    name: deserializationPolicyName,
    async sendRequest(request2, next) {
      let response7 = await next(request2);
      return deserializeResponseBody(jsonContentTypes, xmlContentTypes, response7, updatedOptions, parseXML);
    }
  };
}

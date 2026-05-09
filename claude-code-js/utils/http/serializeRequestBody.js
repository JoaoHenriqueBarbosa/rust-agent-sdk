// function: serializeRequestBody
function serializeRequestBody(request2, operationArguments, operationSpec, stringifyXML = function() {
  throw Error("XML serialization unsupported!");
}) {
  let serializerOptions = operationArguments.options?.serializerOptions, updatedOptions = {
    xml: {
      rootName: serializerOptions?.xml.rootName ?? "",
      includeRoot: serializerOptions?.xml.includeRoot ?? !1,
      xmlCharKey: serializerOptions?.xml.xmlCharKey ?? XML_CHARKEY
    }
  }, xmlCharKey = updatedOptions.xml.xmlCharKey;
  if (operationSpec.requestBody && operationSpec.requestBody.mapper) {
    request2.body = getOperationArgumentValueFromParameter(operationArguments, operationSpec.requestBody);
    let bodyMapper = operationSpec.requestBody.mapper, { required: required2, serializedName, xmlName, xmlElementName, xmlNamespace, xmlNamespacePrefix, nullable: nullable2 } = bodyMapper, typeName = bodyMapper.type.name;
    try {
      if (request2.body !== void 0 && request2.body !== null || nullable2 && request2.body === null || required2) {
        let requestBodyParameterPathString = getPathStringFromParameter(operationSpec.requestBody);
        request2.body = operationSpec.serializer.serialize(bodyMapper, request2.body, requestBodyParameterPathString, updatedOptions);
        let isStream3 = typeName === MapperTypeNames.Stream;
        if (operationSpec.isXML) {
          let xmlnsKey = xmlNamespacePrefix ? `xmlns:${xmlNamespacePrefix}` : "xmlns", value = getXmlValueWithNamespace(xmlNamespace, xmlnsKey, typeName, request2.body, updatedOptions);
          if (typeName === MapperTypeNames.Sequence)
            request2.body = stringifyXML(prepareXMLRootList(value, xmlElementName || xmlName || serializedName, xmlnsKey, xmlNamespace), { rootName: xmlName || serializedName, xmlCharKey });
          else if (!isStream3)
            request2.body = stringifyXML(value, {
              rootName: xmlName || serializedName,
              xmlCharKey
            });
        } else if (typeName === MapperTypeNames.String && (operationSpec.contentType?.match("text/plain") || operationSpec.mediaType === "text"))
          return;
        else if (!isStream3)
          request2.body = JSON.stringify(request2.body);
      }
    } catch (error43) {
      throw Error(`Error "${error43.message}" occurred in serializing the payload - ${JSON.stringify(serializedName, void 0, "  ")}.`);
    }
  } else if (operationSpec.formDataParameters && operationSpec.formDataParameters.length > 0) {
    request2.formData = {};
    for (let formDataParameter of operationSpec.formDataParameters) {
      let formDataParameterValue = getOperationArgumentValueFromParameter(operationArguments, formDataParameter);
      if (formDataParameterValue !== void 0 && formDataParameterValue !== null) {
        let formDataParameterPropertyName = formDataParameter.mapper.serializedName || getPathStringFromParameter(formDataParameter);
        request2.formData[formDataParameterPropertyName] = operationSpec.serializer.serialize(formDataParameter.mapper, formDataParameterValue, getPathStringFromParameter(formDataParameter), updatedOptions);
      }
    }
  }
}

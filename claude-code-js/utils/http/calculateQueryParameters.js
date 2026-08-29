// function: calculateQueryParameters
function calculateQueryParameters(operationSpec, operationArguments, fallbackObject) {
  let result = /* @__PURE__ */ new Map, sequenceParams = /* @__PURE__ */ new Set;
  if (operationSpec.queryParameters?.length)
    for (let queryParameter of operationSpec.queryParameters) {
      if (queryParameter.mapper.type.name === "Sequence" && queryParameter.mapper.serializedName)
        sequenceParams.add(queryParameter.mapper.serializedName);
      let queryParameterValue = getOperationArgumentValueFromParameter(operationArguments, queryParameter, fallbackObject);
      if (queryParameterValue !== void 0 && queryParameterValue !== null || queryParameter.mapper.required) {
        queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter));
        let delimiter = queryParameter.collectionFormat ? CollectionFormatToDelimiterMap[queryParameter.collectionFormat] : "";
        if (Array.isArray(queryParameterValue))
          queryParameterValue = queryParameterValue.map((item) => {
            if (item === null || item === void 0)
              return "";
            return item;
          });
        if (queryParameter.collectionFormat === "Multi" && queryParameterValue.length === 0)
          continue;
        else if (Array.isArray(queryParameterValue) && (queryParameter.collectionFormat === "SSV" || queryParameter.collectionFormat === "TSV"))
          queryParameterValue = queryParameterValue.join(delimiter);
        if (!queryParameter.skipEncoding)
          if (Array.isArray(queryParameterValue))
            queryParameterValue = queryParameterValue.map((item) => {
              return encodeURIComponent(item);
            });
          else
            queryParameterValue = encodeURIComponent(queryParameterValue);
        if (Array.isArray(queryParameterValue) && (queryParameter.collectionFormat === "CSV" || queryParameter.collectionFormat === "Pipes"))
          queryParameterValue = queryParameterValue.join(delimiter);
        result.set(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
      }
    }
  return {
    queryParams: result,
    sequenceParams
  };
}

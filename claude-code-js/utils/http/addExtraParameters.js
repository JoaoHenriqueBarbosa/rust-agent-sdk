// function: addExtraParameters
function addExtraParameters(parameters, extraParams) {
  Object.entries(extraParams).forEach(([key, value]) => {
    if (!parameters.has(key) && value)
      parameters.set(key, value);
  });
}

// function: mapToQueryString
function mapToQueryString(parameters) {
  let queryParameterArray = [];
  return parameters.forEach((value, key) => {
    queryParameterArray.push(`${key}=${encodeURIComponent(value)}`);
  }), queryParameterArray.join("&");
}

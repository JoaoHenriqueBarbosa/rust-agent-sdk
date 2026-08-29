// function: stripLeadingHashOrQuery
function stripLeadingHashOrQuery(responseString) {
  if (responseString.startsWith("#/"))
    return responseString.substring(2);
  else if (responseString.startsWith("#") || responseString.startsWith("?"))
    return responseString.substring(1);
  return responseString;
}

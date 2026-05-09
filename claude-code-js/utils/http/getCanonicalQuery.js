// var: getCanonicalQuery
var getCanonicalQuery = ({ query = {} }) => {
  let keys2 = [], serialized = {};
  for (let key of Object.keys(query).sort()) {
    if (key.toLowerCase() === SIGNATURE_HEADER)
      continue;
    keys2.push(key);
    let value = query[key];
    if (typeof value === "string")
      serialized[key] = `${escapeUri(key)}=${escapeUri(value)}`;
    else if (Array.isArray(value))
      serialized[key] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${escapeUri(key)}=${escapeUri(value2)}`]), []).sort().join("&");
  }
  return keys2.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};

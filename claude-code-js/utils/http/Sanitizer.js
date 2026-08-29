// class: Sanitizer
class Sanitizer {
  allowedHeaderNames;
  allowedQueryParameters;
  constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [] } = {}) {
    allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames), allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters), this.allowedHeaderNames = new Set(allowedHeaderNames.map((n5) => n5.toLowerCase())), this.allowedQueryParameters = new Set(allowedQueryParameters.map((p4) => p4.toLowerCase()));
  }
  sanitize(obj) {
    let seen = /* @__PURE__ */ new Set;
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error)
        return {
          ...value,
          name: value.name,
          message: value.message
        };
      if (key === "headers")
        return this.sanitizeHeaders(value);
      else if (key === "url")
        return this.sanitizeUrl(value);
      else if (key === "query")
        return this.sanitizeQuery(value);
      else if (key === "body")
        return;
      else if (key === "response")
        return;
      else if (key === "operationSpec")
        return;
      else if (Array.isArray(value) || isObject5(value)) {
        if (seen.has(value))
          return "[Circular]";
        seen.add(value);
      }
      return value;
    }, 2);
  }
  sanitizeUrl(value) {
    if (typeof value !== "string" || value === null || value === "")
      return value;
    let url3 = new URL(value);
    if (!url3.search)
      return value;
    for (let [key] of url3.searchParams)
      if (!this.allowedQueryParameters.has(key.toLowerCase()))
        url3.searchParams.set(key, RedactedString);
    return url3.toString();
  }
  sanitizeHeaders(obj) {
    let sanitized = {};
    for (let key of Object.keys(obj))
      if (this.allowedHeaderNames.has(key.toLowerCase()))
        sanitized[key] = obj[key];
      else
        sanitized[key] = RedactedString;
    return sanitized;
  }
  sanitizeQuery(value) {
    if (typeof value !== "object" || value === null)
      return value;
    let sanitized = {};
    for (let k3 of Object.keys(value))
      if (this.allowedQueryParameters.has(k3.toLowerCase()))
        sanitized[k3] = value[k3];
      else
        sanitized[k3] = RedactedString;
    return sanitized;
  }
}

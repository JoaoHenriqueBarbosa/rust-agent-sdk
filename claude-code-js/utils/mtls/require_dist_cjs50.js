// var: require_dist_cjs50
var require_dist_cjs50 = __commonJS((exports) => {
  var types3 = require_dist_cjs49();

  class EndpointCache {
    capacity;
    data = /* @__PURE__ */ new Map;
    parameters = [];
    constructor({ size, params }) {
      if (this.capacity = size ?? 50, params)
        this.parameters = params;
    }
    get(endpointParams, resolver) {
      let key = this.hash(endpointParams);
      if (key === !1)
        return resolver();
      if (!this.data.has(key)) {
        if (this.data.size > this.capacity + 10) {
          let keys2 = this.data.keys(), i2 = 0;
          while (!0) {
            let { value, done } = keys2.next();
            if (this.data.delete(value), done || ++i2 > 10)
              break;
          }
        }
        this.data.set(key, resolver());
      }
      return this.data.get(key);
    }
    size() {
      return this.data.size;
    }
    hash(endpointParams) {
      let buffer = "", { parameters } = this;
      if (parameters.length === 0)
        return !1;
      for (let param of parameters) {
        let val = String(endpointParams[param] ?? "");
        if (val.includes("|;"))
          return !1;
        buffer += val + "|;";
      }
      return buffer;
    }
  }
  var IP_V4_REGEX = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"), isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]"), VALID_HOST_LABEL_REGEX = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"), isValidHostLabel = (value, allowSubDomains = !1) => {
    if (!allowSubDomains)
      return VALID_HOST_LABEL_REGEX.test(value);
    let labels = value.split(".");
    for (let label of labels)
      if (!isValidHostLabel(label))
        return !1;
    return !0;
  }, customEndpointFunctions = {}, debugId = "endpoints";
  function toDebugString(input) {
    if (typeof input !== "object" || input == null)
      return input;
    if ("ref" in input)
      return `$${toDebugString(input.ref)}`;
    if ("fn" in input)
      return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
    return JSON.stringify(input, null, 2);
  }

  class EndpointError extends Error {
    constructor(message) {
      super(message);
      this.name = "EndpointError";
    }
  }
  var booleanEquals = (value1, value2) => value1 === value2, getAttrPathList = (path9) => {
    let parts = path9.split("."), pathList = [];
    for (let part of parts) {
      let squareBracketIndex = part.indexOf("[");
      if (squareBracketIndex !== -1) {
        if (part.indexOf("]") !== part.length - 1)
          throw new EndpointError(`Path: '${path9}' does not end with ']'`);
        let arrayIndex = part.slice(squareBracketIndex + 1, -1);
        if (Number.isNaN(parseInt(arrayIndex)))
          throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path9}'`);
        if (squareBracketIndex !== 0)
          pathList.push(part.slice(0, squareBracketIndex));
        pathList.push(arrayIndex);
      } else
        pathList.push(part);
    }
    return pathList;
  }, getAttr = (value, path9) => getAttrPathList(path9).reduce((acc, index) => {
    if (typeof acc !== "object")
      throw new EndpointError(`Index '${index}' in '${path9}' not found in '${JSON.stringify(value)}'`);
    else if (Array.isArray(acc))
      return acc[parseInt(index)];
    return acc[index];
  }, value), isSet2 = (value) => value != null, not = (value) => !value, DEFAULT_PORTS2 = {
    [types3.EndpointURLScheme.HTTP]: 80,
    [types3.EndpointURLScheme.HTTPS]: 443
  }, parseURL = (value) => {
    let whatwgURL = (() => {
      try {
        if (value instanceof URL)
          return value;
        if (typeof value === "object" && "hostname" in value) {
          let { hostname: hostname3, port, protocol: protocol2 = "", path: path9 = "", query = {} } = value, url3 = new URL(`${protocol2}//${hostname3}${port ? `:${port}` : ""}${path9}`);
          return url3.search = Object.entries(query).map(([k, v]) => `${k}=${v}`).join("&"), url3;
        }
        return new URL(value);
      } catch (error41) {
        return null;
      }
    })();
    if (!whatwgURL)
      return console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`), null;
    let urlString = whatwgURL.href, { host, hostname: hostname2, pathname, protocol, search } = whatwgURL;
    if (search)
      return null;
    let scheme = protocol.slice(0, -1);
    if (!Object.values(types3.EndpointURLScheme).includes(scheme))
      return null;
    let isIp = isIpAddress(hostname2), inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS2[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS2[scheme]}`), authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS2[scheme]}` : ""}`;
    return {
      scheme,
      authority,
      path: pathname,
      normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
      isIp
    };
  }, stringEquals = (value1, value2) => value1 === value2, substring = (input, start, stop, reverse) => {
    if (start >= stop || input.length < stop || /[^\u0000-\u007f]/.test(input))
      return null;
    if (!reverse)
      return input.substring(start, stop);
    return input.substring(input.length - stop, input.length - start);
  }, uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c3) => `%${c3.charCodeAt(0).toString(16).toUpperCase()}`), endpointFunctions = {
    booleanEquals,
    getAttr,
    isSet: isSet2,
    isValidHostLabel,
    not,
    parseURL,
    stringEquals,
    substring,
    uriEncode
  }, evaluateTemplate = (template, options) => {
    let evaluatedTemplateArr = [], templateContext = {
      ...options.endpointParams,
      ...options.referenceRecord
    }, currentIndex = 0;
    while (currentIndex < template.length) {
      let openingBraceIndex = template.indexOf("{", currentIndex);
      if (openingBraceIndex === -1) {
        evaluatedTemplateArr.push(template.slice(currentIndex));
        break;
      }
      evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
      let closingBraceIndex = template.indexOf("}", openingBraceIndex);
      if (closingBraceIndex === -1) {
        evaluatedTemplateArr.push(template.slice(openingBraceIndex));
        break;
      }
      if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}")
        evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex)), currentIndex = closingBraceIndex + 2;
      let parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
      if (parameterName.includes("#")) {
        let [refName, attrName] = parameterName.split("#");
        evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
      } else
        evaluatedTemplateArr.push(templateContext[parameterName]);
      currentIndex = closingBraceIndex + 1;
    }
    return evaluatedTemplateArr.join("");
  }, getReferenceValue = ({ ref }, options) => {
    return {
      ...options.endpointParams,
      ...options.referenceRecord
    }[ref];
  }, evaluateExpression = (obj, keyName, options) => {
    if (typeof obj === "string")
      return evaluateTemplate(obj, options);
    else if (obj.fn)
      return group$2.callFunction(obj, options);
    else if (obj.ref)
      return getReferenceValue(obj, options);
    throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
  }, callFunction = ({ fn, argv }, options) => {
    let evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : group$2.evaluateExpression(arg, "arg", options)), fnSegments = fn.split(".");
    if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null)
      return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
    return endpointFunctions[fn](...evaluatedArgs);
  }, group$2 = {
    evaluateExpression,
    callFunction
  }, evaluateCondition = ({ assign, ...fnArgs }, options) => {
    if (assign && assign in options.referenceRecord)
      throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
    let value = callFunction(fnArgs, options);
    return options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`), {
      result: value === "" ? !0 : !!value,
      ...assign != null && { toAssign: { name: assign, value } }
    };
  }, evaluateConditions = (conditions = [], options) => {
    let conditionsReferenceRecord = {};
    for (let condition of conditions) {
      let { result, toAssign } = evaluateCondition(condition, {
        ...options,
        referenceRecord: {
          ...options.referenceRecord,
          ...conditionsReferenceRecord
        }
      });
      if (!result)
        return { result };
      if (toAssign)
        conditionsReferenceRecord[toAssign.name] = toAssign.value, options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
    return { result: !0, referenceRecord: conditionsReferenceRecord };
  }, getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
    ...acc,
    [headerKey]: headerVal.map((headerValEntry) => {
      let processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
      if (typeof processedExpr !== "string")
        throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
      return processedExpr;
    })
  }), {}), getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
    ...acc,
    [propertyKey]: group$1.getEndpointProperty(propertyVal, options)
  }), {}), getEndpointProperty = (property2, options) => {
    if (Array.isArray(property2))
      return property2.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
    switch (typeof property2) {
      case "string":
        return evaluateTemplate(property2, options);
      case "object":
        if (property2 === null)
          throw new EndpointError(`Unexpected endpoint property: ${property2}`);
        return group$1.getEndpointProperties(property2, options);
      case "boolean":
        return property2;
      default:
        throw new EndpointError(`Unexpected endpoint property type: ${typeof property2}`);
    }
  }, group$1 = {
    getEndpointProperty,
    getEndpointProperties
  }, getEndpointUrl = (endpointUrl, options) => {
    let expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
    if (typeof expression === "string")
      try {
        return new URL(expression);
      } catch (error41) {
        throw console.error(`Failed to construct URL with ${expression}`, error41), error41;
      }
    throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
  }, evaluateEndpointRule = (endpointRule, options) => {
    let { conditions, endpoint: endpoint2 } = endpointRule, { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result)
      return;
    let endpointRuleOptions = {
      ...options,
      referenceRecord: { ...options.referenceRecord, ...referenceRecord }
    }, { url: url3, properties, headers } = endpoint2;
    return options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint2)}`), {
      ...headers != null && {
        headers: getEndpointHeaders(headers, endpointRuleOptions)
      },
      ...properties != null && {
        properties: getEndpointProperties(properties, endpointRuleOptions)
      },
      url: getEndpointUrl(url3, endpointRuleOptions)
    };
  }, evaluateErrorRule = (errorRule, options) => {
    let { conditions, error: error41 } = errorRule, { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result)
      return;
    throw new EndpointError(evaluateExpression(error41, "Error", {
      ...options,
      referenceRecord: { ...options.referenceRecord, ...referenceRecord }
    }));
  }, evaluateRules = (rules, options) => {
    for (let rule of rules)
      if (rule.type === "endpoint") {
        let endpointOrUndefined = evaluateEndpointRule(rule, options);
        if (endpointOrUndefined)
          return endpointOrUndefined;
      } else if (rule.type === "error")
        evaluateErrorRule(rule, options);
      else if (rule.type === "tree") {
        let endpointOrUndefined = group.evaluateTreeRule(rule, options);
        if (endpointOrUndefined)
          return endpointOrUndefined;
      } else
        throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    throw new EndpointError("Rules evaluation failed");
  }, evaluateTreeRule = (treeRule, options) => {
    let { conditions, rules } = treeRule, { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result)
      return;
    return group.evaluateRules(rules, {
      ...options,
      referenceRecord: { ...options.referenceRecord, ...referenceRecord }
    });
  }, group = {
    evaluateRules,
    evaluateTreeRule
  }, resolveEndpoint = (ruleSetObject, options) => {
    let { endpointParams, logger: logger2 } = options, { parameters, rules } = ruleSetObject;
    options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
    let paramsWithDefault = Object.entries(parameters).filter(([, v]) => v.default != null).map(([k, v]) => [k, v.default]);
    if (paramsWithDefault.length > 0)
      for (let [paramKey, paramDefaultValue] of paramsWithDefault)
        endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    let requiredParams = Object.entries(parameters).filter(([, v]) => v.required).map(([k]) => k);
    for (let requiredParam of requiredParams)
      if (endpointParams[requiredParam] == null)
        throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    let endpoint2 = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
    return options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint2)}`), endpoint2;
  };
  exports.EndpointCache = EndpointCache;
  exports.EndpointError = EndpointError;
  exports.customEndpointFunctions = customEndpointFunctions;
  exports.isIpAddress = isIpAddress;
  exports.isValidHostLabel = isValidHostLabel;
  exports.resolveEndpoint = resolveEndpoint;
});

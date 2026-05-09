// Original: src/utils/mcp/elicitationValidation.ts
function isMultiSelectEnumSchema(schema5) {
  return schema5.type === "array" && "items" in schema5 && typeof schema5.items === "object" && schema5.items !== null && (("enum" in schema5.items) || ("anyOf" in schema5.items));
}
function getMultiSelectValues(schema5) {
  if ("anyOf" in schema5.items)
    return schema5.items.anyOf.map((item) => item.const);
  if ("enum" in schema5.items)
    return schema5.items.enum;
  return [];
}
function getMultiSelectLabels(schema5) {
  if ("anyOf" in schema5.items)
    return schema5.items.anyOf.map((item) => item.title);
  if ("enum" in schema5.items)
    return schema5.items.enum;
  return [];
}
function getMultiSelectLabel(schema5, value) {
  let index2 = getMultiSelectValues(schema5).indexOf(value);
  return index2 >= 0 ? getMultiSelectLabels(schema5)[index2] ?? value : value;
}
function getEnumValues2(schema5) {
  if ("oneOf" in schema5)
    return schema5.oneOf.map((item) => item.const);
  if ("enum" in schema5)
    return schema5.enum;
  return [];
}
function getEnumLabels(schema5) {
  if ("oneOf" in schema5)
    return schema5.oneOf.map((item) => item.title);
  if ("enum" in schema5)
    return ("enumNames" in schema5 ? schema5.enumNames : void 0) ?? schema5.enum;
  return [];
}
function getEnumLabel(schema5, value) {
  let index2 = getEnumValues2(schema5).indexOf(value);
  return index2 >= 0 ? getEnumLabels(schema5)[index2] ?? value : value;
}
function getZodSchema(schema5) {
  if (isEnumSchema(schema5)) {
    let [first, ...rest] = getEnumValues2(schema5);
    if (!first)
      return exports_external.never();
    return exports_external.enum([first, ...rest]);
  }
  if (schema5.type === "string") {
    let stringSchema = exports_external.string();
    if (schema5.minLength !== void 0)
      stringSchema = stringSchema.min(schema5.minLength, {
        message: `Must be at least ${schema5.minLength} ${plural(schema5.minLength, "character")}`
      });
    if (schema5.maxLength !== void 0)
      stringSchema = stringSchema.max(schema5.maxLength, {
        message: `Must be at most ${schema5.maxLength} ${plural(schema5.maxLength, "character")}`
      });
    switch (schema5.format) {
      case "email":
        stringSchema = stringSchema.email({
          message: "Must be a valid email address, e.g. user@example.com"
        });
        break;
      case "uri":
        stringSchema = stringSchema.url({
          message: "Must be a valid URI, e.g. https://example.com"
        });
        break;
      case "date":
        stringSchema = stringSchema.date("Must be a valid date, e.g. 2024-03-15, today, next Monday");
        break;
      case "date-time":
        stringSchema = stringSchema.datetime({
          offset: !0,
          message: "Must be a valid date-time, e.g. 2024-03-15T14:30:00Z, tomorrow at 3pm"
        });
        break;
      default:
        break;
    }
    return stringSchema;
  }
  if (schema5.type === "number" || schema5.type === "integer") {
    let typeLabel = schema5.type === "integer" ? "an integer" : "a number", isInteger = schema5.type === "integer", formatNum = (n6) => Number.isInteger(n6) && !isInteger ? `${n6}.0` : String(n6), rangeMsg = schema5.minimum !== void 0 && schema5.maximum !== void 0 ? `Must be ${typeLabel} between ${formatNum(schema5.minimum)} and ${formatNum(schema5.maximum)}` : schema5.minimum !== void 0 ? `Must be ${typeLabel} >= ${formatNum(schema5.minimum)}` : schema5.maximum !== void 0 ? `Must be ${typeLabel} <= ${formatNum(schema5.maximum)}` : `Must be ${typeLabel}`, numberSchema = exports_external.coerce.number({
      error: rangeMsg
    });
    if (schema5.type === "integer")
      numberSchema = numberSchema.int({ message: rangeMsg });
    if (schema5.minimum !== void 0)
      numberSchema = numberSchema.min(schema5.minimum, {
        message: rangeMsg
      });
    if (schema5.maximum !== void 0)
      numberSchema = numberSchema.max(schema5.maximum, {
        message: rangeMsg
      });
    return numberSchema;
  }
  if (schema5.type === "boolean")
    return exports_external.coerce.boolean();
  throw Error(`Unsupported schema: ${jsonStringify(schema5)}`);
}
function validateElicitationInput(stringValue, schema5) {
  let parseResult = getZodSchema(schema5).safeParse(stringValue);
  if (parseResult.success)
    return {
      value: parseResult.data,
      isValid: !0
    };
  return {
    isValid: !1,
    error: parseResult.error.issues.map((e) => e.message).join("; ")
  };
}
function isDateTimeSchema(schema5) {
  return schema5.type === "string" && "format" in schema5 && (schema5.format === "date" || schema5.format === "date-time");
}
async function validateElicitationInputAsync(stringValue, schema5, signal) {
  let syncResult = validateElicitationInput(stringValue, schema5);
  if (syncResult.isValid)
    return syncResult;
  if (isDateTimeSchema(schema5) && !looksLikeISO8601(stringValue)) {
    let parseResult = await parseNaturalLanguageDateTime(stringValue, schema5.format, signal);
    if (parseResult.success) {
      let validatedParsed = validateElicitationInput(parseResult.value, schema5);
      if (validatedParsed.isValid)
        return validatedParsed;
    }
  }
  return syncResult;
}
var isEnumSchema = (schema5) => {
  return schema5.type === "string" && (("enum" in schema5) || ("oneOf" in schema5));
};
var init_elicitationValidation = __esm(() => {
  init_v4();
  init_slowOperations();
  init_dateTimeParser();
});

// function: getMethodLiteral
function getMethodLiteral(schema5) {
  let methodSchema = getObjectShape(schema5)?.method;
  if (!methodSchema)
    throw Error("Schema is missing a method literal");
  let value = getLiteralValue(methodSchema);
  if (typeof value !== "string")
    throw Error("Schema method literal must be a string");
  return value;
}

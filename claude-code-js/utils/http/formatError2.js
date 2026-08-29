// function: formatError2
function formatError2(scope, error43) {
  let message = "ERROR.";
  if (scope?.length)
    message += ` Scopes: ${Array.isArray(scope) ? scope.join(", ") : scope}.`;
  return `${message} Error message: ${typeof error43 === "string" ? error43 : error43.message}.`;
}

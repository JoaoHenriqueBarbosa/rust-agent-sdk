// function: isOperationSpecEmpty
function isOperationSpecEmpty(operationSpec) {
  let expectedStatusCodes = Object.keys(operationSpec.responses);
  return expectedStatusCodes.length === 0 || expectedStatusCodes.length === 1 && expectedStatusCodes[0] === "default";
}

// function: isErrorResponse
function isErrorResponse(errorResponse) {
  return errorResponse && typeof errorResponse.error === "string" && typeof errorResponse.error_description === "string";
}

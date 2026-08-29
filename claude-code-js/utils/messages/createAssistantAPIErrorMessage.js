// function: createAssistantAPIErrorMessage
function createAssistantAPIErrorMessage({
  content,
  apiError,
  error: error44,
  errorDetails
}) {
  return baseCreateAssistantMessage({
    content: [
      {
        type: "text",
        text: content === "" ? NO_CONTENT_MESSAGE : content
      }
    ],
    isApiErrorMessage: !0,
    apiError,
    error: error44,
    errorDetails
  });
}

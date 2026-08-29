// function: getStructuredIO
function getStructuredIO(inputPrompt, options2) {
  let inputStream;
  if (typeof inputPrompt === "string")
    if (inputPrompt.trim() !== "")
      inputStream = fromArray([
        jsonStringify({
          type: "user",
          session_id: "",
          message: {
            role: "user",
            content: inputPrompt
          },
          parent_tool_use_id: null
        })
      ]);
    else
      inputStream = fromArray([]);
  else
    inputStream = inputPrompt;
  return options2.sdkUrl ? new RemoteIO(options2.sdkUrl, inputStream, options2.replayUserMessages) : new StructuredIO(inputStream, options2.replayUserMessages);
}

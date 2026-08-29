// function: queryModelWithoutStreaming
async function queryModelWithoutStreaming({
  messages,
  systemPrompt,
  thinkingConfig,
  tools,
  signal,
  options: options2
}) {
  let assistantMessage;
  for await (let message of withStreamingVCR(messages, async function* () {
    yield* queryModel(messages, systemPrompt, thinkingConfig, tools, signal, options2);
  }))
    if (message.type === "assistant")
      assistantMessage = message;
  if (!assistantMessage) {
    if (signal.aborted)
      throw new APIUserAbortError;
    throw Error("No assistant message found");
  }
  return assistantMessage;
}

// function: queryWithModel
async function queryWithModel({
  systemPrompt = asSystemPrompt([]),
  userPrompt,
  outputFormat,
  signal,
  options: options2
}) {
  return (await withVCR([
    createUserMessage({
      content: systemPrompt.map((text2) => ({ type: "text", text: text2 }))
    }),
    createUserMessage({
      content: userPrompt
    })
  ], async () => {
    let messages = [
      createUserMessage({
        content: userPrompt
      })
    ];
    return [await queryModelWithoutStreaming({
      messages,
      systemPrompt,
      thinkingConfig: { type: "disabled" },
      tools: [],
      signal,
      options: {
        ...options2,
        enablePromptCaching: options2.enablePromptCaching ?? !1,
        outputFormat,
        async getToolPermissionContext() {
          return getEmptyToolPermissionContext();
        }
      }
    })];
  }))[0];
}

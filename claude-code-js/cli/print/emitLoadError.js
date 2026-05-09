// function: emitLoadError
function emitLoadError(message, outputFormat) {
  if (outputFormat === "stream-json") {
    let errorResult = {
      type: "result",
      subtype: "error_during_execution",
      duration_ms: 0,
      duration_api_ms: 0,
      is_error: !0,
      num_turns: 0,
      stop_reason: null,
      session_id: getSessionId(),
      total_cost_usd: 0,
      usage: EMPTY_USAGE,
      modelUsage: {},
      permission_denials: [],
      uuid: randomUUID48(),
      errors: [message]
    };
    process.stdout.write(jsonStringify(errorResult) + `
`);
  } else
    process.stderr.write(message + `
`);
}

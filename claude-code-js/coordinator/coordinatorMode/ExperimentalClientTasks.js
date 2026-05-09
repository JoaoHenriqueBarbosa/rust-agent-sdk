// class: ExperimentalClientTasks
class ExperimentalClientTasks {
  constructor(_client) {
    this._client = _client;
  }
  async* callToolStream(params, resultSchema = CallToolResultSchema, options2) {
    let clientInternal = this._client, optionsWithTask = {
      ...options2,
      task: options2?.task ?? (clientInternal.isToolTask(params.name) ? {} : void 0)
    }, stream10 = clientInternal.requestStream({ method: "tools/call", params }, resultSchema, optionsWithTask), validator = clientInternal.getToolOutputValidator(params.name);
    for await (let message of stream10) {
      if (message.type === "result" && validator) {
        let result = message.result;
        if (!result.structuredContent && !result.isError) {
          yield {
            type: "error",
            error: new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`)
          };
          return;
        }
        if (result.structuredContent)
          try {
            let validationResult = validator(result.structuredContent);
            if (!validationResult.valid) {
              yield {
                type: "error",
                error: new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`)
              };
              return;
            }
          } catch (error44) {
            if (error44 instanceof McpError) {
              yield { type: "error", error: error44 };
              return;
            }
            yield {
              type: "error",
              error: new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error44 instanceof Error ? error44.message : String(error44)}`)
            };
            return;
          }
      }
      yield message;
    }
  }
  async getTask(taskId, options2) {
    return this._client.getTask({ taskId }, options2);
  }
  async getTaskResult(taskId, resultSchema, options2) {
    return this._client.getTaskResult({ taskId }, resultSchema, options2);
  }
  async listTasks(cursor, options2) {
    return this._client.listTasks(cursor ? { cursor } : void 0, options2);
  }
  async cancelTask(taskId, options2) {
    return this._client.cancelTask({ taskId }, options2);
  }
  requestStream(request2, resultSchema, options2) {
    return this._client.requestStream(request2, resultSchema, options2);
  }
}

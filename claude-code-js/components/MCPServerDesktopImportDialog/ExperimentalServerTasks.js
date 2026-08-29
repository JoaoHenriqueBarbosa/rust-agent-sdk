// class: ExperimentalServerTasks
class ExperimentalServerTasks {
  constructor(_server) {
    this._server = _server;
  }
  requestStream(request2, resultSchema, options2) {
    return this._server.requestStream(request2, resultSchema, options2);
  }
  createMessageStream(params, options2) {
    let clientCapabilities = this._server.getClientCapabilities();
    if ((params.tools || params.toolChoice) && !clientCapabilities?.sampling?.tools)
      throw Error("Client does not support sampling tools capability.");
    if (params.messages.length > 0) {
      let lastMessage = params.messages[params.messages.length - 1], lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content], hasToolResults = lastContent.some((c3) => c3.type === "tool_result"), previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0, previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [], hasPreviousToolUse = previousContent.some((c3) => c3.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some((c3) => c3.type !== "tool_result"))
          throw Error("The last message must contain only tool_result content if any is present");
        if (!hasPreviousToolUse)
          throw Error("tool_result blocks are not matching any tool_use from the previous message");
      }
      if (hasPreviousToolUse) {
        let toolUseIds = new Set(previousContent.filter((c3) => c3.type === "tool_use").map((c3) => c3.id)), toolResultIds = new Set(lastContent.filter((c3) => c3.type === "tool_result").map((c3) => c3.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id)))
          throw Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
      }
    }
    return this.requestStream({
      method: "sampling/createMessage",
      params
    }, CreateMessageResultSchema, options2);
  }
  elicitInputStream(params, options2) {
    let clientCapabilities = this._server.getClientCapabilities(), mode = params.mode ?? "form";
    switch (mode) {
      case "url": {
        if (!clientCapabilities?.elicitation?.url)
          throw Error("Client does not support url elicitation.");
        break;
      }
      case "form": {
        if (!clientCapabilities?.elicitation?.form)
          throw Error("Client does not support form elicitation.");
        break;
      }
    }
    let normalizedParams = mode === "form" && params.mode === void 0 ? { ...params, mode: "form" } : params;
    return this.requestStream({
      method: "elicitation/create",
      params: normalizedParams
    }, ElicitResultSchema, options2);
  }
  async getTask(taskId, options2) {
    return this._server.getTask({ taskId }, options2);
  }
  async getTaskResult(taskId, resultSchema, options2) {
    return this._server.getTaskResult({ taskId }, resultSchema, options2);
  }
  async listTasks(cursor, options2) {
    return this._server.listTasks(cursor ? { cursor } : void 0, options2);
  }
  async cancelTask(taskId, options2) {
    return this._server.cancelTask({ taskId }, options2);
  }
}

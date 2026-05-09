// Original: src/services/tools/StreamingToolExecutor.ts
class StreamingToolExecutor {
  toolDefinitions;
  canUseTool;
  tools = [];
  toolUseContext;
  hasErrored = !1;
  erroredToolDescription = "";
  siblingAbortController;
  discarded = !1;
  progressAvailableResolve;
  constructor(toolDefinitions, canUseTool, toolUseContext) {
    this.toolDefinitions = toolDefinitions;
    this.canUseTool = canUseTool;
    this.toolUseContext = toolUseContext, this.siblingAbortController = createChildAbortController(toolUseContext.abortController);
  }
  discard() {
    this.discarded = !0;
  }
  addTool(block2, assistantMessage) {
    let toolDefinition = findToolByName(this.toolDefinitions, block2.name);
    if (!toolDefinition) {
      this.tools.push({
        id: block2.id,
        block: block2,
        assistantMessage,
        status: "completed",
        isConcurrencySafe: !0,
        pendingProgress: [],
        results: [
          createUserMessage({
            content: [
              {
                type: "tool_result",
                content: `<tool_use_error>Error: No such tool available: ${block2.name}</tool_use_error>`,
                is_error: !0,
                tool_use_id: block2.id
              }
            ],
            toolUseResult: `Error: No such tool available: ${block2.name}`,
            sourceToolAssistantUUID: assistantMessage.uuid
          })
        ]
      });
      return;
    }
    let parsedInput = toolDefinition.inputSchema.safeParse(block2.input), isConcurrencySafe = parsedInput?.success ? (() => {
      try {
        return Boolean(toolDefinition.isConcurrencySafe(parsedInput.data));
      } catch {
        return !1;
      }
    })() : !1;
    this.tools.push({
      id: block2.id,
      block: block2,
      assistantMessage,
      status: "queued",
      isConcurrencySafe,
      pendingProgress: []
    }), this.processQueue();
  }
  canExecuteTool(isConcurrencySafe) {
    let executingTools = this.tools.filter((t2) => t2.status === "executing");
    return executingTools.length === 0 || isConcurrencySafe && executingTools.every((t2) => t2.isConcurrencySafe);
  }
  async processQueue() {
    for (let tool of this.tools) {
      if (tool.status !== "queued")
        continue;
      if (this.canExecuteTool(tool.isConcurrencySafe))
        await this.executeTool(tool);
      else if (!tool.isConcurrencySafe)
        break;
    }
  }
  createSyntheticErrorMessage(toolUseId, reason, assistantMessage) {
    if (reason === "user_interrupted")
      return createUserMessage({
        content: [
          {
            type: "tool_result",
            content: withMemoryCorrectionHint(REJECT_MESSAGE),
            is_error: !0,
            tool_use_id: toolUseId
          }
        ],
        toolUseResult: "User rejected tool use",
        sourceToolAssistantUUID: assistantMessage.uuid
      });
    if (reason === "streaming_fallback")
      return createUserMessage({
        content: [
          {
            type: "tool_result",
            content: "<tool_use_error>Error: Streaming fallback - tool execution discarded</tool_use_error>",
            is_error: !0,
            tool_use_id: toolUseId
          }
        ],
        toolUseResult: "Streaming fallback - tool execution discarded",
        sourceToolAssistantUUID: assistantMessage.uuid
      });
    let desc = this.erroredToolDescription, msg = desc ? `Cancelled: parallel tool call ${desc} errored` : "Cancelled: parallel tool call errored";
    return createUserMessage({
      content: [
        {
          type: "tool_result",
          content: `<tool_use_error>${msg}</tool_use_error>`,
          is_error: !0,
          tool_use_id: toolUseId
        }
      ],
      toolUseResult: msg,
      sourceToolAssistantUUID: assistantMessage.uuid
    });
  }
  getAbortReason(tool) {
    if (this.discarded)
      return "streaming_fallback";
    if (this.hasErrored)
      return "sibling_error";
    if (this.toolUseContext.abortController.signal.aborted) {
      if (this.toolUseContext.abortController.signal.reason === "interrupt")
        return this.getToolInterruptBehavior(tool) === "cancel" ? "user_interrupted" : null;
      return "user_interrupted";
    }
    return null;
  }
  getToolInterruptBehavior(tool) {
    let definition = findToolByName(this.toolDefinitions, tool.block.name);
    if (!definition?.interruptBehavior)
      return "block";
    try {
      return definition.interruptBehavior();
    } catch {
      return "block";
    }
  }
  getToolDescription(tool) {
    let input = tool.block.input, summary = input?.command ?? input?.file_path ?? input?.pattern ?? "";
    if (typeof summary === "string" && summary.length > 0) {
      let truncated = summary.length > 40 ? summary.slice(0, 40) + "\u2026" : summary;
      return `${tool.block.name}(${truncated})`;
    }
    return tool.block.name;
  }
  updateInterruptibleState() {
    let executing = this.tools.filter((t2) => t2.status === "executing");
    this.toolUseContext.setHasInterruptibleToolInProgress?.(executing.length > 0 && executing.every((t2) => this.getToolInterruptBehavior(t2) === "cancel"));
  }
  async executeTool(tool) {
    tool.status = "executing", this.toolUseContext.setInProgressToolUseIDs((prev) => new Set(prev).add(tool.id)), this.updateInterruptibleState();
    let messages = [], contextModifiers = [], promise3 = (async () => {
      let initialAbortReason = this.getAbortReason(tool);
      if (initialAbortReason) {
        messages.push(this.createSyntheticErrorMessage(tool.id, initialAbortReason, tool.assistantMessage)), tool.results = messages, tool.contextModifiers = contextModifiers, tool.status = "completed", this.updateInterruptibleState();
        return;
      }
      let toolAbortController = createChildAbortController(this.siblingAbortController);
      toolAbortController.signal.addEventListener("abort", () => {
        if (toolAbortController.signal.reason !== "sibling_error" && !this.toolUseContext.abortController.signal.aborted && !this.discarded)
          this.toolUseContext.abortController.abort(toolAbortController.signal.reason);
      }, { once: !0 });
      let generator = runToolUse(tool.block, tool.assistantMessage, this.canUseTool, { ...this.toolUseContext, abortController: toolAbortController }), thisToolErrored = !1;
      for await (let update2 of generator) {
        let abortReason = this.getAbortReason(tool);
        if (abortReason && !thisToolErrored) {
          messages.push(this.createSyntheticErrorMessage(tool.id, abortReason, tool.assistantMessage));
          break;
        }
        if (update2.message.type === "user" && Array.isArray(update2.message.message.content) && update2.message.message.content.some((_) => _.type === "tool_result" && _.is_error === !0)) {
          if (thisToolErrored = !0, tool.block.name === BASH_TOOL_NAME)
            this.hasErrored = !0, this.erroredToolDescription = this.getToolDescription(tool), this.siblingAbortController.abort("sibling_error");
        }
        if (update2.message)
          if (update2.message.type === "progress") {
            if (tool.pendingProgress.push(update2.message), this.progressAvailableResolve)
              this.progressAvailableResolve(), this.progressAvailableResolve = void 0;
          } else
            messages.push(update2.message);
        if (update2.contextModifier)
          contextModifiers.push(update2.contextModifier.modifyContext);
      }
      if (tool.results = messages, tool.contextModifiers = contextModifiers, tool.status = "completed", this.updateInterruptibleState(), !tool.isConcurrencySafe && contextModifiers.length > 0)
        for (let modifier of contextModifiers)
          this.toolUseContext = modifier(this.toolUseContext);
    })();
    tool.promise = promise3, promise3.finally(() => {
      this.processQueue();
    });
  }
  *getCompletedResults() {
    if (this.discarded)
      return;
    for (let tool of this.tools) {
      while (tool.pendingProgress.length > 0)
        yield { message: tool.pendingProgress.shift(), newContext: this.toolUseContext };
      if (tool.status === "yielded")
        continue;
      if (tool.status === "completed" && tool.results) {
        tool.status = "yielded";
        for (let message of tool.results)
          yield { message, newContext: this.toolUseContext };
        markToolUseAsComplete2(this.toolUseContext, tool.id);
      } else if (tool.status === "executing" && !tool.isConcurrencySafe)
        break;
    }
  }
  hasPendingProgress() {
    return this.tools.some((t2) => t2.pendingProgress.length > 0);
  }
  async* getRemainingResults() {
    if (this.discarded)
      return;
    while (this.hasUnfinishedTools()) {
      await this.processQueue();
      for (let result of this.getCompletedResults())
        yield result;
      if (this.hasExecutingTools() && !this.hasCompletedResults() && !this.hasPendingProgress()) {
        let executingPromises = this.tools.filter((t2) => t2.status === "executing" && t2.promise).map((t2) => t2.promise), progressPromise = new Promise((resolve35) => {
          this.progressAvailableResolve = resolve35;
        });
        if (executingPromises.length > 0)
          await Promise.race([...executingPromises, progressPromise]);
      }
    }
    for (let result of this.getCompletedResults())
      yield result;
  }
  hasCompletedResults() {
    return this.tools.some((t2) => t2.status === "completed");
  }
  hasExecutingTools() {
    return this.tools.some((t2) => t2.status === "executing");
  }
  hasUnfinishedTools() {
    return this.tools.some((t2) => t2.status !== "yielded");
  }
  getUpdatedContext() {
    return this.toolUseContext;
  }
}
function markToolUseAsComplete2(toolUseContext, toolUseID) {
  toolUseContext.setInProgressToolUseIDs((prev) => {
    let next2 = new Set(prev);
    return next2.delete(toolUseID), next2;
  });
}
var init_StreamingToolExecutor = __esm(() => {
  init_messages3();
  init_Tool();
  init_abortController();
  init_toolExecution();
});

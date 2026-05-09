// var: init_server4
var init_server4 = __esm(() => {
  init_protocol();
  init_types();
  init_ajv_provider();
  init_zod_compat();
  init_server3();
  Server = class Server extends Protocol {
    constructor(_serverInfo, options2) {
      super(options2);
      if (this._serverInfo = _serverInfo, this._loggingLevels = /* @__PURE__ */ new Map, this.LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index2) => [level, index2])), this.isMessageIgnored = (level, sessionId) => {
        let currentLevel = this._loggingLevels.get(sessionId);
        return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : !1;
      }, this._capabilities = options2?.capabilities ?? {}, this._instructions = options2?.instructions, this._jsonSchemaValidator = options2?.jsonSchemaValidator ?? new AjvJsonSchemaValidator, this.setRequestHandler(InitializeRequestSchema, (request2) => this._oninitialize(request2)), this.setNotificationHandler(InitializedNotificationSchema, () => this.oninitialized?.()), this._capabilities.logging)
        this.setRequestHandler(SetLevelRequestSchema, async (request2, extra) => {
          let transportSessionId = extra.sessionId || extra.requestInfo?.headers["mcp-session-id"] || void 0, { level } = request2.params, parseResult = LoggingLevelSchema.safeParse(level);
          if (parseResult.success)
            this._loggingLevels.set(transportSessionId, parseResult.data);
          return {};
        });
    }
    get experimental() {
      if (!this._experimental)
        this._experimental = {
          tasks: new ExperimentalServerTasks(this)
        };
      return this._experimental;
    }
    registerCapabilities(capabilities) {
      if (this.transport)
        throw Error("Cannot register capabilities after connecting to transport");
      this._capabilities = mergeCapabilities(this._capabilities, capabilities);
    }
    setRequestHandler(requestSchema, handler4) {
      let methodSchema = getObjectShape(requestSchema)?.method;
      if (!methodSchema)
        throw Error("Schema is missing a method literal");
      let methodValue;
      if (isZ4Schema(methodSchema)) {
        let v4Schema = methodSchema;
        methodValue = v4Schema._zod?.def?.value ?? v4Schema.value;
      } else {
        let v3Schema = methodSchema;
        methodValue = v3Schema._def?.value ?? v3Schema.value;
      }
      if (typeof methodValue !== "string")
        throw Error("Schema method literal must be a string");
      if (methodValue === "tools/call") {
        let wrappedHandler = async (request2, extra) => {
          let validatedRequest = safeParse3(CallToolRequestSchema, request2);
          if (!validatedRequest.success) {
            let errorMessage4 = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call request: ${errorMessage4}`);
          }
          let { params } = validatedRequest.data, result = await Promise.resolve(handler4(request2, extra));
          if (params.task) {
            let taskValidationResult = safeParse3(CreateTaskResultSchema, result);
            if (!taskValidationResult.success) {
              let errorMessage4 = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
              throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage4}`);
            }
            return taskValidationResult.data;
          }
          let validationResult = safeParse3(CallToolResultSchema, result);
          if (!validationResult.success) {
            let errorMessage4 = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call result: ${errorMessage4}`);
          }
          return validationResult.data;
        };
        return super.setRequestHandler(requestSchema, wrappedHandler);
      }
      return super.setRequestHandler(requestSchema, handler4);
    }
    assertCapabilityForMethod(method) {
      switch (method) {
        case "sampling/createMessage":
          if (!this._clientCapabilities?.sampling)
            throw Error(`Client does not support sampling (required for ${method})`);
          break;
        case "elicitation/create":
          if (!this._clientCapabilities?.elicitation)
            throw Error(`Client does not support elicitation (required for ${method})`);
          break;
        case "roots/list":
          if (!this._clientCapabilities?.roots)
            throw Error(`Client does not support listing roots (required for ${method})`);
          break;
        case "ping":
          break;
      }
    }
    assertNotificationCapability(method) {
      switch (method) {
        case "notifications/message":
          if (!this._capabilities.logging)
            throw Error(`Server does not support logging (required for ${method})`);
          break;
        case "notifications/resources/updated":
        case "notifications/resources/list_changed":
          if (!this._capabilities.resources)
            throw Error(`Server does not support notifying about resources (required for ${method})`);
          break;
        case "notifications/tools/list_changed":
          if (!this._capabilities.tools)
            throw Error(`Server does not support notifying of tool list changes (required for ${method})`);
          break;
        case "notifications/prompts/list_changed":
          if (!this._capabilities.prompts)
            throw Error(`Server does not support notifying of prompt list changes (required for ${method})`);
          break;
        case "notifications/elicitation/complete":
          if (!this._clientCapabilities?.elicitation?.url)
            throw Error(`Client does not support URL elicitation (required for ${method})`);
          break;
        case "notifications/cancelled":
          break;
        case "notifications/progress":
          break;
      }
    }
    assertRequestHandlerCapability(method) {
      if (!this._capabilities)
        return;
      switch (method) {
        case "completion/complete":
          if (!this._capabilities.completions)
            throw Error(`Server does not support completions (required for ${method})`);
          break;
        case "logging/setLevel":
          if (!this._capabilities.logging)
            throw Error(`Server does not support logging (required for ${method})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!this._capabilities.prompts)
            throw Error(`Server does not support prompts (required for ${method})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
          if (!this._capabilities.resources)
            throw Error(`Server does not support resources (required for ${method})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!this._capabilities.tools)
            throw Error(`Server does not support tools (required for ${method})`);
          break;
        case "tasks/get":
        case "tasks/list":
        case "tasks/result":
        case "tasks/cancel":
          if (!this._capabilities.tasks)
            throw Error(`Server does not support tasks capability (required for ${method})`);
          break;
        case "ping":
        case "initialize":
          break;
      }
    }
    assertTaskCapability(method) {
      assertClientRequestTaskCapability(this._clientCapabilities?.tasks?.requests, method, "Client");
    }
    assertTaskHandlerCapability(method) {
      if (!this._capabilities)
        return;
      assertToolsCallTaskCapability(this._capabilities.tasks?.requests, method, "Server");
    }
    async _oninitialize(request2) {
      let requestedVersion = request2.params.protocolVersion;
      return this._clientCapabilities = request2.params.capabilities, this._clientVersion = request2.params.clientInfo, {
        protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION,
        capabilities: this.getCapabilities(),
        serverInfo: this._serverInfo,
        ...this._instructions && { instructions: this._instructions }
      };
    }
    getClientCapabilities() {
      return this._clientCapabilities;
    }
    getClientVersion() {
      return this._clientVersion;
    }
    getCapabilities() {
      return this._capabilities;
    }
    async ping() {
      return this.request({ method: "ping" }, EmptyResultSchema);
    }
    async createMessage(params, options2) {
      if (params.tools || params.toolChoice) {
        if (!this._clientCapabilities?.sampling?.tools)
          throw Error("Client does not support sampling tools capability.");
      }
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
      if (params.tools)
        return this.request({ method: "sampling/createMessage", params }, CreateMessageResultWithToolsSchema, options2);
      return this.request({ method: "sampling/createMessage", params }, CreateMessageResultSchema, options2);
    }
    async elicitInput(params, options2) {
      switch (params.mode ?? "form") {
        case "url": {
          if (!this._clientCapabilities?.elicitation?.url)
            throw Error("Client does not support url elicitation.");
          let urlParams = params;
          return this.request({ method: "elicitation/create", params: urlParams }, ElicitResultSchema, options2);
        }
        case "form": {
          if (!this._clientCapabilities?.elicitation?.form)
            throw Error("Client does not support form elicitation.");
          let formParams = params.mode === "form" ? params : { ...params, mode: "form" }, result = await this.request({ method: "elicitation/create", params: formParams }, ElicitResultSchema, options2);
          if (result.action === "accept" && result.content && formParams.requestedSchema)
            try {
              let validationResult = this._jsonSchemaValidator.getValidator(formParams.requestedSchema)(result.content);
              if (!validationResult.valid)
                throw new McpError(ErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
            } catch (error44) {
              if (error44 instanceof McpError)
                throw error44;
              throw new McpError(ErrorCode.InternalError, `Error validating elicitation response: ${error44 instanceof Error ? error44.message : String(error44)}`);
            }
          return result;
        }
      }
    }
    createElicitationCompletionNotifier(elicitationId, options2) {
      if (!this._clientCapabilities?.elicitation?.url)
        throw Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
      return () => this.notification({
        method: "notifications/elicitation/complete",
        params: {
          elicitationId
        }
      }, options2);
    }
    async listRoots(params, options2) {
      return this.request({ method: "roots/list", params }, ListRootsResultSchema, options2);
    }
    async sendLoggingMessage(params, sessionId) {
      if (this._capabilities.logging) {
        if (!this.isMessageIgnored(params.level, sessionId))
          return this.notification({ method: "notifications/message", params });
      }
    }
    async sendResourceUpdated(params) {
      return this.notification({
        method: "notifications/resources/updated",
        params
      });
    }
    async sendResourceListChanged() {
      return this.notification({
        method: "notifications/resources/list_changed"
      });
    }
    async sendToolListChanged() {
      return this.notification({ method: "notifications/tools/list_changed" });
    }
    async sendPromptListChanged() {
      return this.notification({ method: "notifications/prompts/list_changed" });
    }
  };
});

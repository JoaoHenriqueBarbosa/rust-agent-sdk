// var: init_client19
var init_client19 = __esm(() => {
  init_protocol();
  init_types();
  init_ajv_provider();
  init_zod_compat();
  init_client18();
  Client5 = class Client5 extends Protocol {
    constructor(_clientInfo, options2) {
      super(options2);
      if (this._clientInfo = _clientInfo, this._cachedToolOutputValidators = /* @__PURE__ */ new Map, this._cachedKnownTaskTools = /* @__PURE__ */ new Set, this._cachedRequiredTaskTools = /* @__PURE__ */ new Set, this._listChangedDebounceTimers = /* @__PURE__ */ new Map, this._capabilities = options2?.capabilities ?? {}, this._jsonSchemaValidator = options2?.jsonSchemaValidator ?? new AjvJsonSchemaValidator, options2?.listChanged)
        this._pendingListChangedConfig = options2.listChanged;
    }
    _setupListChangedHandlers(config10) {
      if (config10.tools && this._serverCapabilities?.tools?.listChanged)
        this._setupListChangedHandler("tools", ToolListChangedNotificationSchema, config10.tools, async () => {
          return (await this.listTools()).tools;
        });
      if (config10.prompts && this._serverCapabilities?.prompts?.listChanged)
        this._setupListChangedHandler("prompts", PromptListChangedNotificationSchema, config10.prompts, async () => {
          return (await this.listPrompts()).prompts;
        });
      if (config10.resources && this._serverCapabilities?.resources?.listChanged)
        this._setupListChangedHandler("resources", ResourceListChangedNotificationSchema, config10.resources, async () => {
          return (await this.listResources()).resources;
        });
    }
    get experimental() {
      if (!this._experimental)
        this._experimental = {
          tasks: new ExperimentalClientTasks(this)
        };
      return this._experimental;
    }
    registerCapabilities(capabilities) {
      if (this.transport)
        throw Error("Cannot register capabilities after connecting to transport");
      this._capabilities = mergeCapabilities(this._capabilities, capabilities);
    }
    setRequestHandler(requestSchema, handler) {
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
      let method = methodValue;
      if (method === "elicitation/create") {
        let wrappedHandler = async (request2, extra) => {
          let validatedRequest = safeParse3(ElicitRequestSchema, request2);
          if (!validatedRequest.success) {
            let errorMessage2 = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation request: ${errorMessage2}`);
          }
          let { params } = validatedRequest.data;
          params.mode = params.mode ?? "form";
          let { supportsFormMode, supportsUrlMode } = getSupportedElicitationModes(this._capabilities.elicitation);
          if (params.mode === "form" && !supportsFormMode)
            throw new McpError(ErrorCode.InvalidParams, "Client does not support form-mode elicitation requests");
          if (params.mode === "url" && !supportsUrlMode)
            throw new McpError(ErrorCode.InvalidParams, "Client does not support URL-mode elicitation requests");
          let result = await Promise.resolve(handler(request2, extra));
          if (params.task) {
            let taskValidationResult = safeParse3(CreateTaskResultSchema, result);
            if (!taskValidationResult.success) {
              let errorMessage2 = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
              throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage2}`);
            }
            return taskValidationResult.data;
          }
          let validationResult = safeParse3(ElicitResultSchema, result);
          if (!validationResult.success) {
            let errorMessage2 = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation result: ${errorMessage2}`);
          }
          let validatedResult = validationResult.data, requestedSchema = params.mode === "form" ? params.requestedSchema : void 0;
          if (params.mode === "form" && validatedResult.action === "accept" && validatedResult.content && requestedSchema) {
            if (this._capabilities.elicitation?.form?.applyDefaults)
              try {
                applyElicitationDefaults(requestedSchema, validatedResult.content);
              } catch {}
          }
          return validatedResult;
        };
        return super.setRequestHandler(requestSchema, wrappedHandler);
      }
      if (method === "sampling/createMessage") {
        let wrappedHandler = async (request2, extra) => {
          let validatedRequest = safeParse3(CreateMessageRequestSchema, request2);
          if (!validatedRequest.success) {
            let errorMessage2 = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid sampling request: ${errorMessage2}`);
          }
          let { params } = validatedRequest.data, result = await Promise.resolve(handler(request2, extra));
          if (params.task) {
            let taskValidationResult = safeParse3(CreateTaskResultSchema, result);
            if (!taskValidationResult.success) {
              let errorMessage2 = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
              throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage2}`);
            }
            return taskValidationResult.data;
          }
          let resultSchema = params.tools || params.toolChoice ? CreateMessageResultWithToolsSchema : CreateMessageResultSchema, validationResult = safeParse3(resultSchema, result);
          if (!validationResult.success) {
            let errorMessage2 = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid sampling result: ${errorMessage2}`);
          }
          return validationResult.data;
        };
        return super.setRequestHandler(requestSchema, wrappedHandler);
      }
      return super.setRequestHandler(requestSchema, handler);
    }
    assertCapability(capability, method) {
      if (!this._serverCapabilities?.[capability])
        throw Error(`Server does not support ${capability} (required for ${method})`);
    }
    async connect(transport, options2) {
      if (await super.connect(transport), transport.sessionId !== void 0)
        return;
      try {
        let result = await this.request({
          method: "initialize",
          params: {
            protocolVersion: LATEST_PROTOCOL_VERSION,
            capabilities: this._capabilities,
            clientInfo: this._clientInfo
          }
        }, InitializeResultSchema, options2);
        if (result === void 0)
          throw Error(`Server sent invalid initialize result: ${result}`);
        if (!SUPPORTED_PROTOCOL_VERSIONS.includes(result.protocolVersion))
          throw Error(`Server's protocol version is not supported: ${result.protocolVersion}`);
        if (this._serverCapabilities = result.capabilities, this._serverVersion = result.serverInfo, transport.setProtocolVersion)
          transport.setProtocolVersion(result.protocolVersion);
        if (this._instructions = result.instructions, await this.notification({
          method: "notifications/initialized"
        }), this._pendingListChangedConfig)
          this._setupListChangedHandlers(this._pendingListChangedConfig), this._pendingListChangedConfig = void 0;
      } catch (error44) {
        throw this.close(), error44;
      }
    }
    getServerCapabilities() {
      return this._serverCapabilities;
    }
    getServerVersion() {
      return this._serverVersion;
    }
    getInstructions() {
      return this._instructions;
    }
    assertCapabilityForMethod(method) {
      switch (method) {
        case "logging/setLevel":
          if (!this._serverCapabilities?.logging)
            throw Error(`Server does not support logging (required for ${method})`);
          break;
        case "prompts/get":
        case "prompts/list":
          if (!this._serverCapabilities?.prompts)
            throw Error(`Server does not support prompts (required for ${method})`);
          break;
        case "resources/list":
        case "resources/templates/list":
        case "resources/read":
        case "resources/subscribe":
        case "resources/unsubscribe":
          if (!this._serverCapabilities?.resources)
            throw Error(`Server does not support resources (required for ${method})`);
          if (method === "resources/subscribe" && !this._serverCapabilities.resources.subscribe)
            throw Error(`Server does not support resource subscriptions (required for ${method})`);
          break;
        case "tools/call":
        case "tools/list":
          if (!this._serverCapabilities?.tools)
            throw Error(`Server does not support tools (required for ${method})`);
          break;
        case "completion/complete":
          if (!this._serverCapabilities?.completions)
            throw Error(`Server does not support completions (required for ${method})`);
          break;
        case "initialize":
          break;
        case "ping":
          break;
      }
    }
    assertNotificationCapability(method) {
      switch (method) {
        case "notifications/roots/list_changed":
          if (!this._capabilities.roots?.listChanged)
            throw Error(`Client does not support roots list changed notifications (required for ${method})`);
          break;
        case "notifications/initialized":
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
        case "sampling/createMessage":
          if (!this._capabilities.sampling)
            throw Error(`Client does not support sampling capability (required for ${method})`);
          break;
        case "elicitation/create":
          if (!this._capabilities.elicitation)
            throw Error(`Client does not support elicitation capability (required for ${method})`);
          break;
        case "roots/list":
          if (!this._capabilities.roots)
            throw Error(`Client does not support roots capability (required for ${method})`);
          break;
        case "tasks/get":
        case "tasks/list":
        case "tasks/result":
        case "tasks/cancel":
          if (!this._capabilities.tasks)
            throw Error(`Client does not support tasks capability (required for ${method})`);
          break;
        case "ping":
          break;
      }
    }
    assertTaskCapability(method) {
      assertToolsCallTaskCapability(this._serverCapabilities?.tasks?.requests, method, "Server");
    }
    assertTaskHandlerCapability(method) {
      if (!this._capabilities)
        return;
      assertClientRequestTaskCapability(this._capabilities.tasks?.requests, method, "Client");
    }
    async ping(options2) {
      return this.request({ method: "ping" }, EmptyResultSchema, options2);
    }
    async complete(params, options2) {
      return this.request({ method: "completion/complete", params }, CompleteResultSchema, options2);
    }
    async setLoggingLevel(level, options2) {
      return this.request({ method: "logging/setLevel", params: { level } }, EmptyResultSchema, options2);
    }
    async getPrompt(params, options2) {
      return this.request({ method: "prompts/get", params }, GetPromptResultSchema, options2);
    }
    async listPrompts(params, options2) {
      return this.request({ method: "prompts/list", params }, ListPromptsResultSchema, options2);
    }
    async listResources(params, options2) {
      return this.request({ method: "resources/list", params }, ListResourcesResultSchema, options2);
    }
    async listResourceTemplates(params, options2) {
      return this.request({ method: "resources/templates/list", params }, ListResourceTemplatesResultSchema, options2);
    }
    async readResource(params, options2) {
      return this.request({ method: "resources/read", params }, ReadResourceResultSchema, options2);
    }
    async subscribeResource(params, options2) {
      return this.request({ method: "resources/subscribe", params }, EmptyResultSchema, options2);
    }
    async unsubscribeResource(params, options2) {
      return this.request({ method: "resources/unsubscribe", params }, EmptyResultSchema, options2);
    }
    async callTool(params, resultSchema = CallToolResultSchema, options2) {
      if (this.isToolTaskRequired(params.name))
        throw new McpError(ErrorCode.InvalidRequest, `Tool "${params.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
      let result = await this.request({ method: "tools/call", params }, resultSchema, options2), validator = this.getToolOutputValidator(params.name);
      if (validator) {
        if (!result.structuredContent && !result.isError)
          throw new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`);
        if (result.structuredContent)
          try {
            let validationResult = validator(result.structuredContent);
            if (!validationResult.valid)
              throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`);
          } catch (error44) {
            if (error44 instanceof McpError)
              throw error44;
            throw new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error44 instanceof Error ? error44.message : String(error44)}`);
          }
      }
      return result;
    }
    isToolTask(toolName) {
      if (!this._serverCapabilities?.tasks?.requests?.tools?.call)
        return !1;
      return this._cachedKnownTaskTools.has(toolName);
    }
    isToolTaskRequired(toolName) {
      return this._cachedRequiredTaskTools.has(toolName);
    }
    cacheToolMetadata(tools) {
      this._cachedToolOutputValidators.clear(), this._cachedKnownTaskTools.clear(), this._cachedRequiredTaskTools.clear();
      for (let tool of tools) {
        if (tool.outputSchema) {
          let toolValidator = this._jsonSchemaValidator.getValidator(tool.outputSchema);
          this._cachedToolOutputValidators.set(tool.name, toolValidator);
        }
        let taskSupport = tool.execution?.taskSupport;
        if (taskSupport === "required" || taskSupport === "optional")
          this._cachedKnownTaskTools.add(tool.name);
        if (taskSupport === "required")
          this._cachedRequiredTaskTools.add(tool.name);
      }
    }
    getToolOutputValidator(toolName) {
      return this._cachedToolOutputValidators.get(toolName);
    }
    async listTools(params, options2) {
      let result = await this.request({ method: "tools/list", params }, ListToolsResultSchema, options2);
      return this.cacheToolMetadata(result.tools), result;
    }
    _setupListChangedHandler(listType, notificationSchema, options2, fetcher) {
      let parseResult = ListChangedOptionsBaseSchema.safeParse(options2);
      if (!parseResult.success)
        throw Error(`Invalid ${listType} listChanged options: ${parseResult.error.message}`);
      if (typeof options2.onChanged !== "function")
        throw Error(`Invalid ${listType} listChanged options: onChanged must be a function`);
      let { autoRefresh, debounceMs } = parseResult.data, { onChanged } = options2, refresh = async () => {
        if (!autoRefresh) {
          onChanged(null, null);
          return;
        }
        try {
          let items = await fetcher();
          onChanged(null, items);
        } catch (e) {
          let error44 = e instanceof Error ? e : Error(String(e));
          onChanged(error44, null);
        }
      }, handler = () => {
        if (debounceMs) {
          let existingTimer = this._listChangedDebounceTimers.get(listType);
          if (existingTimer)
            clearTimeout(existingTimer);
          let timer = setTimeout(refresh, debounceMs);
          this._listChangedDebounceTimers.set(listType, timer);
        } else
          refresh();
      };
      this.setNotificationHandler(notificationSchema, handler);
    }
    async sendRootsListChanged() {
      return this.notification({ method: "notifications/roots/list_changed" });
    }
  };
});

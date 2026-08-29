// var: LATEST_PROTOCOL_VERSION
var LATEST_PROTOCOL_VERSION = "2025-11-25", SUPPORTED_PROTOCOL_VERSIONS, RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task", JSONRPC_VERSION = "2.0", AssertObjectSchema, ProgressTokenSchema, CursorSchema, TaskCreationParamsSchema, TaskMetadataSchema, RelatedTaskMetadataSchema, RequestMetaSchema, BaseRequestParamsSchema, TaskAugmentedRequestParamsSchema, isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success, RequestSchema, NotificationsParamsSchema, NotificationSchema, ResultSchema, RequestIdSchema, JSONRPCRequestSchema, isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success, JSONRPCNotificationSchema, isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success, JSONRPCResultResponseSchema, isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success, ErrorCode, JSONRPCErrorResponseSchema, isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success, JSONRPCMessageSchema, JSONRPCResponseSchema, EmptyResultSchema, CancelledNotificationParamsSchema, CancelledNotificationSchema, IconSchema, IconsSchema, BaseMetadataSchema, ImplementationSchema, FormElicitationCapabilitySchema, ElicitationCapabilitySchema, ClientTasksCapabilitySchema, ServerTasksCapabilitySchema, ClientCapabilitiesSchema, InitializeRequestParamsSchema, InitializeRequestSchema, ServerCapabilitiesSchema, InitializeResultSchema, InitializedNotificationSchema, isInitializedNotification = (value) => InitializedNotificationSchema.safeParse(value).success, PingRequestSchema, ProgressSchema, ProgressNotificationParamsSchema, ProgressNotificationSchema, PaginatedRequestParamsSchema, PaginatedRequestSchema, PaginatedResultSchema, TaskStatusSchema, TaskSchema, CreateTaskResultSchema, TaskStatusNotificationParamsSchema, TaskStatusNotificationSchema, GetTaskRequestSchema, GetTaskResultSchema, GetTaskPayloadRequestSchema, GetTaskPayloadResultSchema, ListTasksRequestSchema, ListTasksResultSchema, CancelTaskRequestSchema, CancelTaskResultSchema, ResourceContentsSchema, TextResourceContentsSchema, Base64Schema, BlobResourceContentsSchema, RoleSchema, AnnotationsSchema, ResourceSchema, ResourceTemplateSchema, ListResourcesRequestSchema, ListResourcesResultSchema, ListResourceTemplatesRequestSchema, ListResourceTemplatesResultSchema, ResourceRequestParamsSchema, ReadResourceRequestParamsSchema, ReadResourceRequestSchema, ReadResourceResultSchema, ResourceListChangedNotificationSchema, SubscribeRequestParamsSchema, SubscribeRequestSchema, UnsubscribeRequestParamsSchema, UnsubscribeRequestSchema, ResourceUpdatedNotificationParamsSchema, ResourceUpdatedNotificationSchema, PromptArgumentSchema, PromptSchema, ListPromptsRequestSchema, ListPromptsResultSchema, GetPromptRequestParamsSchema, GetPromptRequestSchema, TextContentSchema, ImageContentSchema, AudioContentSchema, ToolUseContentSchema, EmbeddedResourceSchema, ResourceLinkSchema, ContentBlockSchema, PromptMessageSchema, GetPromptResultSchema, PromptListChangedNotificationSchema, ToolAnnotationsSchema, ToolExecutionSchema, ToolSchema, ListToolsRequestSchema, ListToolsResultSchema, CallToolResultSchema, CompatibilityCallToolResultSchema, CallToolRequestParamsSchema, CallToolRequestSchema, ToolListChangedNotificationSchema, ListChangedOptionsBaseSchema, LoggingLevelSchema, SetLevelRequestParamsSchema, SetLevelRequestSchema, LoggingMessageNotificationParamsSchema, LoggingMessageNotificationSchema, ModelHintSchema, ModelPreferencesSchema, ToolChoiceSchema, ToolResultContentSchema, SamplingContentSchema, SamplingMessageContentBlockSchema, SamplingMessageSchema, CreateMessageRequestParamsSchema, CreateMessageRequestSchema, CreateMessageResultSchema, CreateMessageResultWithToolsSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema, UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema, LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema, EnumSchemaSchema, PrimitiveSchemaDefinitionSchema, ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema, ElicitRequestParamsSchema, ElicitRequestSchema, ElicitationCompleteNotificationParamsSchema, ElicitationCompleteNotificationSchema, ElicitResultSchema, ResourceTemplateReferenceSchema, PromptReferenceSchema, CompleteRequestParamsSchema, CompleteRequestSchema, CompleteResultSchema, RootSchema, ListRootsRequestSchema, ListRootsResultSchema, RootsListChangedNotificationSchema, ClientRequestSchema, ClientNotificationSchema, ClientResultSchema, ServerRequestSchema, ServerNotificationSchema, ServerResultSchema, McpError, UrlElicitationRequiredError;
var init_types = __esm(() => {
  init_v4();
  SUPPORTED_PROTOCOL_VERSIONS = [LATEST_PROTOCOL_VERSION, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"], AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function")), ProgressTokenSchema = union([string2(), number2().int()]), CursorSchema = string2(), TaskCreationParamsSchema = looseObject({
    ttl: number2().optional(),
    pollInterval: number2().optional()
  }), TaskMetadataSchema = object({
    ttl: number2().optional()
  }), RelatedTaskMetadataSchema = object({
    taskId: string2()
  }), RequestMetaSchema = looseObject({
    progressToken: ProgressTokenSchema.optional(),
    [RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
  }), BaseRequestParamsSchema = object({
    _meta: RequestMetaSchema.optional()
  }), TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({
    task: TaskMetadataSchema.optional()
  }), RequestSchema = object({
    method: string2(),
    params: BaseRequestParamsSchema.loose().optional()
  }), NotificationsParamsSchema = object({
    _meta: RequestMetaSchema.optional()
  }), NotificationSchema = object({
    method: string2(),
    params: NotificationsParamsSchema.loose().optional()
  }), ResultSchema = looseObject({
    _meta: RequestMetaSchema.optional()
  }), RequestIdSchema = union([string2(), number2().int()]), JSONRPCRequestSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema,
    ...RequestSchema.shape
  }).strict(), JSONRPCNotificationSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    ...NotificationSchema.shape
  }).strict(), JSONRPCResultResponseSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema,
    result: ResultSchema
  }).strict();
  (function(ErrorCode2) {
    ErrorCode2[ErrorCode2.ConnectionClosed = -32000] = "ConnectionClosed", ErrorCode2[ErrorCode2.RequestTimeout = -32001] = "RequestTimeout", ErrorCode2[ErrorCode2.ParseError = -32700] = "ParseError", ErrorCode2[ErrorCode2.InvalidRequest = -32600] = "InvalidRequest", ErrorCode2[ErrorCode2.MethodNotFound = -32601] = "MethodNotFound", ErrorCode2[ErrorCode2.InvalidParams = -32602] = "InvalidParams", ErrorCode2[ErrorCode2.InternalError = -32603] = "InternalError", ErrorCode2[ErrorCode2.UrlElicitationRequired = -32042] = "UrlElicitationRequired";
  })(ErrorCode || (ErrorCode = {}));
  JSONRPCErrorResponseSchema = object({
    jsonrpc: literal(JSONRPC_VERSION),
    id: RequestIdSchema.optional(),
    error: object({
      code: number2().int(),
      message: string2(),
      data: unknown().optional()
    })
  }).strict(), JSONRPCMessageSchema = union([
    JSONRPCRequestSchema,
    JSONRPCNotificationSchema,
    JSONRPCResultResponseSchema,
    JSONRPCErrorResponseSchema
  ]), JSONRPCResponseSchema = union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]), EmptyResultSchema = ResultSchema.strict(), CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
    requestId: RequestIdSchema.optional(),
    reason: string2().optional()
  }), CancelledNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/cancelled"),
    params: CancelledNotificationParamsSchema
  }), IconSchema = object({
    src: string2(),
    mimeType: string2().optional(),
    sizes: array(string2()).optional(),
    theme: _enum2(["light", "dark"]).optional()
  }), IconsSchema = object({
    icons: array(IconSchema).optional()
  }), BaseMetadataSchema = object({
    name: string2(),
    title: string2().optional()
  }), ImplementationSchema = BaseMetadataSchema.extend({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    version: string2(),
    websiteUrl: string2().optional(),
    description: string2().optional()
  }), FormElicitationCapabilitySchema = intersection(object({
    applyDefaults: boolean2().optional()
  }), record(string2(), unknown())), ElicitationCapabilitySchema = preprocess((value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (Object.keys(value).length === 0)
        return { form: {} };
    }
    return value;
  }, intersection(object({
    form: FormElicitationCapabilitySchema.optional(),
    url: AssertObjectSchema.optional()
  }), record(string2(), unknown()).optional())), ClientTasksCapabilitySchema = looseObject({
    list: AssertObjectSchema.optional(),
    cancel: AssertObjectSchema.optional(),
    requests: looseObject({
      sampling: looseObject({
        createMessage: AssertObjectSchema.optional()
      }).optional(),
      elicitation: looseObject({
        create: AssertObjectSchema.optional()
      }).optional()
    }).optional()
  }), ServerTasksCapabilitySchema = looseObject({
    list: AssertObjectSchema.optional(),
    cancel: AssertObjectSchema.optional(),
    requests: looseObject({
      tools: looseObject({
        call: AssertObjectSchema.optional()
      }).optional()
    }).optional()
  }), ClientCapabilitiesSchema = object({
    experimental: record(string2(), AssertObjectSchema).optional(),
    sampling: object({
      context: AssertObjectSchema.optional(),
      tools: AssertObjectSchema.optional()
    }).optional(),
    elicitation: ElicitationCapabilitySchema.optional(),
    roots: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ClientTasksCapabilitySchema.optional(),
    extensions: record(string2(), AssertObjectSchema).optional()
  }), InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
    protocolVersion: string2(),
    capabilities: ClientCapabilitiesSchema,
    clientInfo: ImplementationSchema
  }), InitializeRequestSchema = RequestSchema.extend({
    method: literal("initialize"),
    params: InitializeRequestParamsSchema
  }), ServerCapabilitiesSchema = object({
    experimental: record(string2(), AssertObjectSchema).optional(),
    logging: AssertObjectSchema.optional(),
    completions: AssertObjectSchema.optional(),
    prompts: object({
      listChanged: boolean2().optional()
    }).optional(),
    resources: object({
      subscribe: boolean2().optional(),
      listChanged: boolean2().optional()
    }).optional(),
    tools: object({
      listChanged: boolean2().optional()
    }).optional(),
    tasks: ServerTasksCapabilitySchema.optional(),
    extensions: record(string2(), AssertObjectSchema).optional()
  }), InitializeResultSchema = ResultSchema.extend({
    protocolVersion: string2(),
    capabilities: ServerCapabilitiesSchema,
    serverInfo: ImplementationSchema,
    instructions: string2().optional()
  }), InitializedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/initialized"),
    params: NotificationsParamsSchema.optional()
  }), PingRequestSchema = RequestSchema.extend({
    method: literal("ping"),
    params: BaseRequestParamsSchema.optional()
  }), ProgressSchema = object({
    progress: number2(),
    total: optional(number2()),
    message: optional(string2())
  }), ProgressNotificationParamsSchema = object({
    ...NotificationsParamsSchema.shape,
    ...ProgressSchema.shape,
    progressToken: ProgressTokenSchema
  }), ProgressNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/progress"),
    params: ProgressNotificationParamsSchema
  }), PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({
    cursor: CursorSchema.optional()
  }), PaginatedRequestSchema = RequestSchema.extend({
    params: PaginatedRequestParamsSchema.optional()
  }), PaginatedResultSchema = ResultSchema.extend({
    nextCursor: CursorSchema.optional()
  }), TaskStatusSchema = _enum2(["working", "input_required", "completed", "failed", "cancelled"]), TaskSchema = object({
    taskId: string2(),
    status: TaskStatusSchema,
    ttl: union([number2(), _null3()]),
    createdAt: string2(),
    lastUpdatedAt: string2(),
    pollInterval: optional(number2()),
    statusMessage: optional(string2())
  }), CreateTaskResultSchema = ResultSchema.extend({
    task: TaskSchema
  }), TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema), TaskStatusNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/tasks/status"),
    params: TaskStatusNotificationParamsSchema
  }), GetTaskRequestSchema = RequestSchema.extend({
    method: literal("tasks/get"),
    params: BaseRequestParamsSchema.extend({
      taskId: string2()
    })
  }), GetTaskResultSchema = ResultSchema.merge(TaskSchema), GetTaskPayloadRequestSchema = RequestSchema.extend({
    method: literal("tasks/result"),
    params: BaseRequestParamsSchema.extend({
      taskId: string2()
    })
  }), GetTaskPayloadResultSchema = ResultSchema.loose(), ListTasksRequestSchema = PaginatedRequestSchema.extend({
    method: literal("tasks/list")
  }), ListTasksResultSchema = PaginatedResultSchema.extend({
    tasks: array(TaskSchema)
  }), CancelTaskRequestSchema = RequestSchema.extend({
    method: literal("tasks/cancel"),
    params: BaseRequestParamsSchema.extend({
      taskId: string2()
    })
  }), CancelTaskResultSchema = ResultSchema.merge(TaskSchema), ResourceContentsSchema = object({
    uri: string2(),
    mimeType: optional(string2()),
    _meta: record(string2(), unknown()).optional()
  }), TextResourceContentsSchema = ResourceContentsSchema.extend({
    text: string2()
  }), Base64Schema = string2().refine((val) => {
    try {
      return atob(val), !0;
    } catch {
      return !1;
    }
  }, { message: "Invalid Base64 string" }), BlobResourceContentsSchema = ResourceContentsSchema.extend({
    blob: Base64Schema
  }), RoleSchema = _enum2(["user", "assistant"]), AnnotationsSchema = object({
    audience: array(RoleSchema).optional(),
    priority: number2().min(0).max(1).optional(),
    lastModified: exports_iso.datetime({ offset: !0 }).optional()
  }), ResourceSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    uri: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    size: optional(number2()),
    annotations: AnnotationsSchema.optional(),
    _meta: optional(looseObject({}))
  }), ResourceTemplateSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    uriTemplate: string2(),
    description: optional(string2()),
    mimeType: optional(string2()),
    annotations: AnnotationsSchema.optional(),
    _meta: optional(looseObject({}))
  }), ListResourcesRequestSchema = PaginatedRequestSchema.extend({
    method: literal("resources/list")
  }), ListResourcesResultSchema = PaginatedResultSchema.extend({
    resources: array(ResourceSchema)
  }), ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
    method: literal("resources/templates/list")
  }), ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
    resourceTemplates: array(ResourceTemplateSchema)
  }), ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({
    uri: string2()
  }), ReadResourceRequestParamsSchema = ResourceRequestParamsSchema, ReadResourceRequestSchema = RequestSchema.extend({
    method: literal("resources/read"),
    params: ReadResourceRequestParamsSchema
  }), ReadResourceResultSchema = ResultSchema.extend({
    contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema]))
  }), ResourceListChangedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/resources/list_changed"),
    params: NotificationsParamsSchema.optional()
  }), SubscribeRequestParamsSchema = ResourceRequestParamsSchema, SubscribeRequestSchema = RequestSchema.extend({
    method: literal("resources/subscribe"),
    params: SubscribeRequestParamsSchema
  }), UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema, UnsubscribeRequestSchema = RequestSchema.extend({
    method: literal("resources/unsubscribe"),
    params: UnsubscribeRequestParamsSchema
  }), ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({
    uri: string2()
  }), ResourceUpdatedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/resources/updated"),
    params: ResourceUpdatedNotificationParamsSchema
  }), PromptArgumentSchema = object({
    name: string2(),
    description: optional(string2()),
    required: optional(boolean2())
  }), PromptSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    description: optional(string2()),
    arguments: optional(array(PromptArgumentSchema)),
    _meta: optional(looseObject({}))
  }), ListPromptsRequestSchema = PaginatedRequestSchema.extend({
    method: literal("prompts/list")
  }), ListPromptsResultSchema = PaginatedResultSchema.extend({
    prompts: array(PromptSchema)
  }), GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
    name: string2(),
    arguments: record(string2(), string2()).optional()
  }), GetPromptRequestSchema = RequestSchema.extend({
    method: literal("prompts/get"),
    params: GetPromptRequestParamsSchema
  }), TextContentSchema = object({
    type: literal("text"),
    text: string2(),
    annotations: AnnotationsSchema.optional(),
    _meta: record(string2(), unknown()).optional()
  }), ImageContentSchema = object({
    type: literal("image"),
    data: Base64Schema,
    mimeType: string2(),
    annotations: AnnotationsSchema.optional(),
    _meta: record(string2(), unknown()).optional()
  }), AudioContentSchema = object({
    type: literal("audio"),
    data: Base64Schema,
    mimeType: string2(),
    annotations: AnnotationsSchema.optional(),
    _meta: record(string2(), unknown()).optional()
  }), ToolUseContentSchema = object({
    type: literal("tool_use"),
    name: string2(),
    id: string2(),
    input: record(string2(), unknown()),
    _meta: record(string2(), unknown()).optional()
  }), EmbeddedResourceSchema = object({
    type: literal("resource"),
    resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
    annotations: AnnotationsSchema.optional(),
    _meta: record(string2(), unknown()).optional()
  }), ResourceLinkSchema = ResourceSchema.extend({
    type: literal("resource_link")
  }), ContentBlockSchema = union([
    TextContentSchema,
    ImageContentSchema,
    AudioContentSchema,
    ResourceLinkSchema,
    EmbeddedResourceSchema
  ]), PromptMessageSchema = object({
    role: RoleSchema,
    content: ContentBlockSchema
  }), GetPromptResultSchema = ResultSchema.extend({
    description: string2().optional(),
    messages: array(PromptMessageSchema)
  }), PromptListChangedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/prompts/list_changed"),
    params: NotificationsParamsSchema.optional()
  }), ToolAnnotationsSchema = object({
    title: string2().optional(),
    readOnlyHint: boolean2().optional(),
    destructiveHint: boolean2().optional(),
    idempotentHint: boolean2().optional(),
    openWorldHint: boolean2().optional()
  }), ToolExecutionSchema = object({
    taskSupport: _enum2(["required", "optional", "forbidden"]).optional()
  }), ToolSchema = object({
    ...BaseMetadataSchema.shape,
    ...IconsSchema.shape,
    description: string2().optional(),
    inputSchema: object({
      type: literal("object"),
      properties: record(string2(), AssertObjectSchema).optional(),
      required: array(string2()).optional()
    }).catchall(unknown()),
    outputSchema: object({
      type: literal("object"),
      properties: record(string2(), AssertObjectSchema).optional(),
      required: array(string2()).optional()
    }).catchall(unknown()).optional(),
    annotations: ToolAnnotationsSchema.optional(),
    execution: ToolExecutionSchema.optional(),
    _meta: record(string2(), unknown()).optional()
  }), ListToolsRequestSchema = PaginatedRequestSchema.extend({
    method: literal("tools/list")
  }), ListToolsResultSchema = PaginatedResultSchema.extend({
    tools: array(ToolSchema)
  }), CallToolResultSchema = ResultSchema.extend({
    content: array(ContentBlockSchema).default([]),
    structuredContent: record(string2(), unknown()).optional(),
    isError: boolean2().optional()
  }), CompatibilityCallToolResultSchema = CallToolResultSchema.or(ResultSchema.extend({
    toolResult: unknown()
  })), CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    name: string2(),
    arguments: record(string2(), unknown()).optional()
  }), CallToolRequestSchema = RequestSchema.extend({
    method: literal("tools/call"),
    params: CallToolRequestParamsSchema
  }), ToolListChangedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/tools/list_changed"),
    params: NotificationsParamsSchema.optional()
  }), ListChangedOptionsBaseSchema = object({
    autoRefresh: boolean2().default(!0),
    debounceMs: number2().int().nonnegative().default(300)
  }), LoggingLevelSchema = _enum2(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]), SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({
    level: LoggingLevelSchema
  }), SetLevelRequestSchema = RequestSchema.extend({
    method: literal("logging/setLevel"),
    params: SetLevelRequestParamsSchema
  }), LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
    level: LoggingLevelSchema,
    logger: string2().optional(),
    data: unknown()
  }), LoggingMessageNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/message"),
    params: LoggingMessageNotificationParamsSchema
  }), ModelHintSchema = object({
    name: string2().optional()
  }), ModelPreferencesSchema = object({
    hints: array(ModelHintSchema).optional(),
    costPriority: number2().min(0).max(1).optional(),
    speedPriority: number2().min(0).max(1).optional(),
    intelligencePriority: number2().min(0).max(1).optional()
  }), ToolChoiceSchema = object({
    mode: _enum2(["auto", "required", "none"]).optional()
  }), ToolResultContentSchema = object({
    type: literal("tool_result"),
    toolUseId: string2().describe("The unique identifier for the corresponding tool call."),
    content: array(ContentBlockSchema).default([]),
    structuredContent: object({}).loose().optional(),
    isError: boolean2().optional(),
    _meta: record(string2(), unknown()).optional()
  }), SamplingContentSchema = discriminatedUnion("type", [TextContentSchema, ImageContentSchema, AudioContentSchema]), SamplingMessageContentBlockSchema = discriminatedUnion("type", [
    TextContentSchema,
    ImageContentSchema,
    AudioContentSchema,
    ToolUseContentSchema,
    ToolResultContentSchema
  ]), SamplingMessageSchema = object({
    role: RoleSchema,
    content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
    _meta: record(string2(), unknown()).optional()
  }), CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    messages: array(SamplingMessageSchema),
    modelPreferences: ModelPreferencesSchema.optional(),
    systemPrompt: string2().optional(),
    includeContext: _enum2(["none", "thisServer", "allServers"]).optional(),
    temperature: number2().optional(),
    maxTokens: number2().int(),
    stopSequences: array(string2()).optional(),
    metadata: AssertObjectSchema.optional(),
    tools: array(ToolSchema).optional(),
    toolChoice: ToolChoiceSchema.optional()
  }), CreateMessageRequestSchema = RequestSchema.extend({
    method: literal("sampling/createMessage"),
    params: CreateMessageRequestParamsSchema
  }), CreateMessageResultSchema = ResultSchema.extend({
    model: string2(),
    stopReason: optional(_enum2(["endTurn", "stopSequence", "maxTokens"]).or(string2())),
    role: RoleSchema,
    content: SamplingContentSchema
  }), CreateMessageResultWithToolsSchema = ResultSchema.extend({
    model: string2(),
    stopReason: optional(_enum2(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(string2())),
    role: RoleSchema,
    content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
  }), BooleanSchemaSchema = object({
    type: literal("boolean"),
    title: string2().optional(),
    description: string2().optional(),
    default: boolean2().optional()
  }), StringSchemaSchema = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    minLength: number2().optional(),
    maxLength: number2().optional(),
    format: _enum2(["email", "uri", "date", "date-time"]).optional(),
    default: string2().optional()
  }), NumberSchemaSchema = object({
    type: _enum2(["number", "integer"]),
    title: string2().optional(),
    description: string2().optional(),
    minimum: number2().optional(),
    maximum: number2().optional(),
    default: number2().optional()
  }), UntitledSingleSelectEnumSchemaSchema = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    default: string2().optional()
  }), TitledSingleSelectEnumSchemaSchema = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    oneOf: array(object({
      const: string2(),
      title: string2()
    })),
    default: string2().optional()
  }), LegacyTitledEnumSchemaSchema = object({
    type: literal("string"),
    title: string2().optional(),
    description: string2().optional(),
    enum: array(string2()),
    enumNames: array(string2()).optional(),
    default: string2().optional()
  }), SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]), UntitledMultiSelectEnumSchemaSchema = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      type: literal("string"),
      enum: array(string2())
    }),
    default: array(string2()).optional()
  }), TitledMultiSelectEnumSchemaSchema = object({
    type: literal("array"),
    title: string2().optional(),
    description: string2().optional(),
    minItems: number2().optional(),
    maxItems: number2().optional(),
    items: object({
      anyOf: array(object({
        const: string2(),
        title: string2()
      }))
    }),
    default: array(string2()).optional()
  }), MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]), EnumSchemaSchema = union([LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema]), PrimitiveSchemaDefinitionSchema = union([EnumSchemaSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema]), ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    mode: literal("form").optional(),
    message: string2(),
    requestedSchema: object({
      type: literal("object"),
      properties: record(string2(), PrimitiveSchemaDefinitionSchema),
      required: array(string2()).optional()
    })
  }), ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
    mode: literal("url"),
    message: string2(),
    elicitationId: string2(),
    url: string2().url()
  }), ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]), ElicitRequestSchema = RequestSchema.extend({
    method: literal("elicitation/create"),
    params: ElicitRequestParamsSchema
  }), ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({
    elicitationId: string2()
  }), ElicitationCompleteNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/elicitation/complete"),
    params: ElicitationCompleteNotificationParamsSchema
  }), ElicitResultSchema = ResultSchema.extend({
    action: _enum2(["accept", "decline", "cancel"]),
    content: preprocess((val) => val === null ? void 0 : val, record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional())
  }), ResourceTemplateReferenceSchema = object({
    type: literal("ref/resource"),
    uri: string2()
  }), PromptReferenceSchema = object({
    type: literal("ref/prompt"),
    name: string2()
  }), CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
    ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
    argument: object({
      name: string2(),
      value: string2()
    }),
    context: object({
      arguments: record(string2(), string2()).optional()
    }).optional()
  }), CompleteRequestSchema = RequestSchema.extend({
    method: literal("completion/complete"),
    params: CompleteRequestParamsSchema
  }), CompleteResultSchema = ResultSchema.extend({
    completion: looseObject({
      values: array(string2()).max(100),
      total: optional(number2().int()),
      hasMore: optional(boolean2())
    })
  }), RootSchema = object({
    uri: string2().startsWith("file://"),
    name: string2().optional(),
    _meta: record(string2(), unknown()).optional()
  }), ListRootsRequestSchema = RequestSchema.extend({
    method: literal("roots/list"),
    params: BaseRequestParamsSchema.optional()
  }), ListRootsResultSchema = ResultSchema.extend({
    roots: array(RootSchema)
  }), RootsListChangedNotificationSchema = NotificationSchema.extend({
    method: literal("notifications/roots/list_changed"),
    params: NotificationsParamsSchema.optional()
  }), ClientRequestSchema = union([
    PingRequestSchema,
    InitializeRequestSchema,
    CompleteRequestSchema,
    SetLevelRequestSchema,
    GetPromptRequestSchema,
    ListPromptsRequestSchema,
    ListResourcesRequestSchema,
    ListResourceTemplatesRequestSchema,
    ReadResourceRequestSchema,
    SubscribeRequestSchema,
    UnsubscribeRequestSchema,
    CallToolRequestSchema,
    ListToolsRequestSchema,
    GetTaskRequestSchema,
    GetTaskPayloadRequestSchema,
    ListTasksRequestSchema,
    CancelTaskRequestSchema
  ]), ClientNotificationSchema = union([
    CancelledNotificationSchema,
    ProgressNotificationSchema,
    InitializedNotificationSchema,
    RootsListChangedNotificationSchema,
    TaskStatusNotificationSchema
  ]), ClientResultSchema = union([
    EmptyResultSchema,
    CreateMessageResultSchema,
    CreateMessageResultWithToolsSchema,
    ElicitResultSchema,
    ListRootsResultSchema,
    GetTaskResultSchema,
    ListTasksResultSchema,
    CreateTaskResultSchema
  ]), ServerRequestSchema = union([
    PingRequestSchema,
    CreateMessageRequestSchema,
    ElicitRequestSchema,
    ListRootsRequestSchema,
    GetTaskRequestSchema,
    GetTaskPayloadRequestSchema,
    ListTasksRequestSchema,
    CancelTaskRequestSchema
  ]), ServerNotificationSchema = union([
    CancelledNotificationSchema,
    ProgressNotificationSchema,
    LoggingMessageNotificationSchema,
    ResourceUpdatedNotificationSchema,
    ResourceListChangedNotificationSchema,
    ToolListChangedNotificationSchema,
    PromptListChangedNotificationSchema,
    TaskStatusNotificationSchema,
    ElicitationCompleteNotificationSchema
  ]), ServerResultSchema = union([
    EmptyResultSchema,
    InitializeResultSchema,
    CompleteResultSchema,
    GetPromptResultSchema,
    ListPromptsResultSchema,
    ListResourcesResultSchema,
    ListResourceTemplatesResultSchema,
    ReadResourceResultSchema,
    CallToolResultSchema,
    ListToolsResultSchema,
    GetTaskResultSchema,
    ListTasksResultSchema,
    CreateTaskResultSchema
  ]);
  McpError = class McpError extends Error {
    constructor(code, message, data) {
      super(`MCP error ${code}: ${message}`);
      this.code = code, this.data = data, this.name = "McpError";
    }
    static fromError(code, message, data) {
      if (code === ErrorCode.UrlElicitationRequired && data) {
        let errorData = data;
        if (errorData.elicitations)
          return new UrlElicitationRequiredError(errorData.elicitations, message);
      }
      return new McpError(code, message, data);
    }
  };
  UrlElicitationRequiredError = class UrlElicitationRequiredError extends McpError {
    constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
      super(ErrorCode.UrlElicitationRequired, message, {
        elicitations
      });
    }
    get elicitations() {
      return this.data?.elicitations ?? [];
    }
  };
});

// var: init_schemas_02
var init_schemas_02 = __esm(() => {
  init_BedrockRuntimeServiceException();
  init_errors5();
  import_schema6 = __toESM(require_schema(), 1), _s_registry2 = import_schema6.TypeRegistry.for("smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime"), BedrockRuntimeServiceException$ = [-3, "smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime", "BedrockRuntimeServiceException", 0, [], []];
  _s_registry2.registerError(BedrockRuntimeServiceException$, BedrockRuntimeServiceException);
  n0_registry2 = import_schema6.TypeRegistry.for("com.amazonaws.bedrockruntime"), AccessDeniedException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "AccessDeniedException",
    { ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(AccessDeniedException$2, AccessDeniedException2);
  ConflictException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ConflictException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ConflictException$2, ConflictException2);
  InternalServerException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "InternalServerException",
    { ["error"]: "server", ["httpError"]: 500 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(InternalServerException$2, InternalServerException2);
  ModelErrorException$ = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ModelErrorException",
    { ["error"]: "client", ["httpError"]: 424 },
    ["message", "originalStatusCode", "resourceName"],
    [0, 1, 0]
  ];
  n0_registry2.registerError(ModelErrorException$, ModelErrorException);
  ModelNotReadyException$ = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ModelNotReadyException",
    { ["error"]: "client", ["httpError"]: 429 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ModelNotReadyException$, ModelNotReadyException);
  ModelStreamErrorException$ = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ModelStreamErrorException",
    { ["error"]: "client", ["httpError"]: 424 },
    ["message", "originalStatusCode", "originalMessage"],
    [0, 1, 0]
  ];
  n0_registry2.registerError(ModelStreamErrorException$, ModelStreamErrorException);
  ModelTimeoutException$ = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ModelTimeoutException",
    { ["error"]: "client", ["httpError"]: 408 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ModelTimeoutException$, ModelTimeoutException);
  ResourceNotFoundException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ResourceNotFoundException",
    { ["error"]: "client", ["httpError"]: 404 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ResourceNotFoundException$2, ResourceNotFoundException2);
  ServiceQuotaExceededException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ServiceQuotaExceededException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ServiceQuotaExceededException$2, ServiceQuotaExceededException2);
  ServiceUnavailableException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ServiceUnavailableException",
    { ["error"]: "server", ["httpError"]: 503 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ServiceUnavailableException$2, ServiceUnavailableException2);
  ThrottlingException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ThrottlingException",
    { ["error"]: "client", ["httpError"]: 429 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ThrottlingException$2, ThrottlingException2);
  ValidationException$2 = [
    -3,
    "com.amazonaws.bedrockruntime",
    "ValidationException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry2.registerError(ValidationException$2, ValidationException2);
  errorTypeRegistries2 = [
    _s_registry2,
    n0_registry2
  ], AsyncInvokeMessage = [0, "com.amazonaws.bedrockruntime", "AsyncInvokeMessage", 8, 0], Body = [0, "com.amazonaws.bedrockruntime", "Body", 8, 21], GuardrailAutomatedReasoningStatementLogicContent = [0, "com.amazonaws.bedrockruntime", "GuardrailAutomatedReasoningStatementLogicContent", 8, 0], GuardrailAutomatedReasoningStatementNaturalLanguageContent = [0, "com.amazonaws.bedrockruntime", "GuardrailAutomatedReasoningStatementNaturalLanguageContent", 8, 0], ModelInputPayload = [0, "com.amazonaws.bedrockruntime", "ModelInputPayload", 8, 15], PartBody = [0, "com.amazonaws.bedrockruntime", "PartBody", 8, 21], AnyToolChoice$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AnyToolChoice",
    0,
    [],
    []
  ], AppliedGuardrailDetails$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AppliedGuardrailDetails",
    0,
    ["guardrailId", "guardrailVersion", "guardrailArn", "guardrailOrigin", "guardrailOwnership"],
    [0, 0, 0, 64, 0]
  ], ApplyGuardrailRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ApplyGuardrailRequest",
    0,
    ["guardrailIdentifier", "guardrailVersion", "source", "content", "outputScope"],
    [[0, 1], [0, 1], 0, [() => GuardrailContentBlockList, 0], 0],
    4
  ], ApplyGuardrailResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ApplyGuardrailResponse",
    0,
    ["usage", "action", "outputs", "assessments", "actionReason", "guardrailCoverage"],
    [() => GuardrailUsage$, 0, () => GuardrailOutputContentList, [() => GuardrailAssessmentList, 0], 0, () => GuardrailCoverage$],
    4
  ], AsyncInvokeS3OutputDataConfig$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AsyncInvokeS3OutputDataConfig",
    0,
    ["s3Uri", "kmsKeyId", "bucketOwner"],
    [0, 0, 0],
    1
  ], AsyncInvokeSummary$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AsyncInvokeSummary",
    0,
    ["invocationArn", "modelArn", "submitTime", "outputDataConfig", "clientRequestToken", "status", "failureMessage", "lastModifiedTime", "endTime"],
    [0, 0, 5, () => AsyncInvokeOutputDataConfig$, 0, 0, [() => AsyncInvokeMessage, 0], 5, 5],
    4
  ], AudioBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AudioBlock",
    0,
    ["format", "source", "error"],
    [0, [() => AudioSource$, 0], [() => ErrorBlock$, 0]],
    2
  ], AutoToolChoice$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "AutoToolChoice",
    0,
    [],
    []
  ], BidirectionalInputPayloadPart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "BidirectionalInputPayloadPart",
    8,
    ["bytes"],
    [[() => PartBody, 0]]
  ], BidirectionalOutputPayloadPart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "BidirectionalOutputPayloadPart",
    8,
    ["bytes"],
    [[() => PartBody, 0]]
  ], CacheDetail$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CacheDetail",
    0,
    ["ttl", "inputTokens"],
    [0, 1],
    2
  ], CachePointBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CachePointBlock",
    0,
    ["type", "ttl"],
    [0, 0],
    1
  ], Citation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "Citation",
    0,
    ["title", "source", "sourceContent", "location"],
    [0, 0, () => CitationSourceContentList, () => CitationLocation$]
  ], CitationsConfig$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CitationsConfig",
    0,
    ["enabled"],
    [2],
    1
  ], CitationsContentBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CitationsContentBlock",
    0,
    ["content", "citations"],
    [() => CitationGeneratedContentList, () => Citations]
  ], CitationsDelta$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CitationsDelta",
    0,
    ["title", "source", "sourceContent", "location"],
    [0, 0, () => CitationSourceContentListDelta, () => CitationLocation$]
  ], CitationSourceContentDelta$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CitationSourceContentDelta",
    0,
    ["text"],
    [0]
  ], ContentBlockDeltaEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ContentBlockDeltaEvent",
    0,
    ["delta", "contentBlockIndex"],
    [[() => ContentBlockDelta$, 0], 1],
    2
  ], ContentBlockStartEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ContentBlockStartEvent",
    0,
    ["start", "contentBlockIndex"],
    [() => ContentBlockStart$, 1],
    2
  ], ContentBlockStopEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ContentBlockStopEvent",
    0,
    ["contentBlockIndex"],
    [1],
    1
  ], ConverseMetrics$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseMetrics",
    0,
    ["latencyMs"],
    [1],
    1
  ], ConverseRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseRequest",
    0,
    ["modelId", "messages", "system", "inferenceConfig", "toolConfig", "guardrailConfig", "additionalModelRequestFields", "promptVariables", "additionalModelResponseFieldPaths", "requestMetadata", "performanceConfig", "serviceTier", "outputConfig"],
    [[0, 1], [() => Messages3, 0], [() => SystemContentBlocks, 0], () => InferenceConfiguration$, () => ToolConfiguration$, () => GuardrailConfiguration$2, 15, [() => PromptVariableMap, 0], 64, [() => RequestMetadata, 0], () => PerformanceConfiguration$2, () => ServiceTier$, [() => OutputConfig$, 0]],
    1
  ], ConverseResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseResponse",
    0,
    ["output", "stopReason", "usage", "metrics", "additionalModelResponseFields", "trace", "performanceConfig", "serviceTier"],
    [[() => ConverseOutput$, 0], 0, () => TokenUsage$, () => ConverseMetrics$, 15, [() => ConverseTrace$, 0], () => PerformanceConfiguration$2, () => ServiceTier$],
    4
  ], ConverseStreamMetadataEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamMetadataEvent",
    0,
    ["usage", "metrics", "trace", "performanceConfig", "serviceTier"],
    [() => TokenUsage$, () => ConverseStreamMetrics$, [() => ConverseStreamTrace$, 0], () => PerformanceConfiguration$2, () => ServiceTier$],
    2
  ], ConverseStreamMetrics$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamMetrics",
    0,
    ["latencyMs"],
    [1],
    1
  ], ConverseStreamRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamRequest",
    0,
    ["modelId", "messages", "system", "inferenceConfig", "toolConfig", "guardrailConfig", "additionalModelRequestFields", "promptVariables", "additionalModelResponseFieldPaths", "requestMetadata", "performanceConfig", "serviceTier", "outputConfig"],
    [[0, 1], [() => Messages3, 0], [() => SystemContentBlocks, 0], () => InferenceConfiguration$, () => ToolConfiguration$, () => GuardrailStreamConfiguration$, 15, [() => PromptVariableMap, 0], 64, [() => RequestMetadata, 0], () => PerformanceConfiguration$2, () => ServiceTier$, [() => OutputConfig$, 0]],
    1
  ], ConverseStreamResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamResponse",
    0,
    ["stream"],
    [[() => ConverseStreamOutput$, 16]]
  ], ConverseStreamTrace$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamTrace",
    0,
    ["guardrail", "promptRouter"],
    [[() => GuardrailTraceAssessment$, 0], () => PromptRouterTrace$]
  ], ConverseTokensRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseTokensRequest",
    0,
    ["messages", "system", "toolConfig", "additionalModelRequestFields"],
    [[() => Messages3, 0], [() => SystemContentBlocks, 0], () => ToolConfiguration$, 15]
  ], ConverseTrace$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ConverseTrace",
    0,
    ["guardrail", "promptRouter"],
    [[() => GuardrailTraceAssessment$, 0], () => PromptRouterTrace$]
  ], CountTokensRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CountTokensRequest",
    0,
    ["modelId", "input"],
    [[0, 1], [() => CountTokensInput$, 0]],
    2
  ], CountTokensResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "CountTokensResponse",
    0,
    ["inputTokens"],
    [1],
    1
  ], DocumentBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "DocumentBlock",
    0,
    ["name", "source", "format", "context", "citations"],
    [0, () => DocumentSource$, 0, 0, () => CitationsConfig$],
    2
  ], DocumentCharLocation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "DocumentCharLocation",
    0,
    ["documentIndex", "start", "end"],
    [1, 1, 1]
  ], DocumentChunkLocation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "DocumentChunkLocation",
    0,
    ["documentIndex", "start", "end"],
    [1, 1, 1]
  ], DocumentPageLocation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "DocumentPageLocation",
    0,
    ["documentIndex", "start", "end"],
    [1, 1, 1]
  ], ErrorBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ErrorBlock",
    8,
    ["message"],
    [0]
  ], GetAsyncInvokeRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GetAsyncInvokeRequest",
    0,
    ["invocationArn"],
    [[0, 1]],
    1
  ], GetAsyncInvokeResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GetAsyncInvokeResponse",
    0,
    ["invocationArn", "modelArn", "status", "submitTime", "outputDataConfig", "clientRequestToken", "failureMessage", "lastModifiedTime", "endTime"],
    [0, 0, 0, 5, () => AsyncInvokeOutputDataConfig$, 0, [() => AsyncInvokeMessage, 0], 5, 5],
    5
  ], GuardrailAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAssessment",
    0,
    ["topicPolicy", "contentPolicy", "wordPolicy", "sensitiveInformationPolicy", "contextualGroundingPolicy", "automatedReasoningPolicy", "invocationMetrics", "appliedGuardrailDetails"],
    [() => GuardrailTopicPolicyAssessment$, () => GuardrailContentPolicyAssessment$, () => GuardrailWordPolicyAssessment$, () => GuardrailSensitiveInformationPolicyAssessment$, () => GuardrailContextualGroundingPolicyAssessment$, [() => GuardrailAutomatedReasoningPolicyAssessment$, 0], () => GuardrailInvocationMetrics$, () => AppliedGuardrailDetails$]
  ], GuardrailAutomatedReasoningImpossibleFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningImpossibleFinding",
    0,
    ["translation", "contradictingRules", "logicWarning"],
    [[() => GuardrailAutomatedReasoningTranslation$, 0], () => GuardrailAutomatedReasoningRuleList, [() => GuardrailAutomatedReasoningLogicWarning$, 0]]
  ], GuardrailAutomatedReasoningInputTextReference$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningInputTextReference",
    0,
    ["text"],
    [[() => GuardrailAutomatedReasoningStatementNaturalLanguageContent, 0]]
  ], GuardrailAutomatedReasoningInvalidFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningInvalidFinding",
    0,
    ["translation", "contradictingRules", "logicWarning"],
    [[() => GuardrailAutomatedReasoningTranslation$, 0], () => GuardrailAutomatedReasoningRuleList, [() => GuardrailAutomatedReasoningLogicWarning$, 0]]
  ], GuardrailAutomatedReasoningLogicWarning$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningLogicWarning",
    0,
    ["type", "premises", "claims"],
    [0, [() => GuardrailAutomatedReasoningStatementList, 0], [() => GuardrailAutomatedReasoningStatementList, 0]]
  ], GuardrailAutomatedReasoningNoTranslationsFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningNoTranslationsFinding",
    0,
    [],
    []
  ], GuardrailAutomatedReasoningPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningPolicyAssessment",
    0,
    ["findings"],
    [[() => GuardrailAutomatedReasoningFindingList, 0]]
  ], GuardrailAutomatedReasoningRule$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningRule",
    0,
    ["identifier", "policyVersionArn"],
    [0, 0]
  ], GuardrailAutomatedReasoningSatisfiableFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningSatisfiableFinding",
    0,
    ["translation", "claimsTrueScenario", "claimsFalseScenario", "logicWarning"],
    [[() => GuardrailAutomatedReasoningTranslation$, 0], [() => GuardrailAutomatedReasoningScenario$, 0], [() => GuardrailAutomatedReasoningScenario$, 0], [() => GuardrailAutomatedReasoningLogicWarning$, 0]]
  ], GuardrailAutomatedReasoningScenario$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningScenario",
    0,
    ["statements"],
    [[() => GuardrailAutomatedReasoningStatementList, 0]]
  ], GuardrailAutomatedReasoningStatement$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningStatement",
    0,
    ["logic", "naturalLanguage"],
    [[() => GuardrailAutomatedReasoningStatementLogicContent, 0], [() => GuardrailAutomatedReasoningStatementNaturalLanguageContent, 0]]
  ], GuardrailAutomatedReasoningTooComplexFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTooComplexFinding",
    0,
    [],
    []
  ], GuardrailAutomatedReasoningTranslation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTranslation",
    0,
    ["premises", "claims", "untranslatedPremises", "untranslatedClaims", "confidence"],
    [[() => GuardrailAutomatedReasoningStatementList, 0], [() => GuardrailAutomatedReasoningStatementList, 0], [() => GuardrailAutomatedReasoningInputTextReferenceList, 0], [() => GuardrailAutomatedReasoningInputTextReferenceList, 0], 1]
  ], GuardrailAutomatedReasoningTranslationAmbiguousFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
    0,
    ["options", "differenceScenarios"],
    [[() => GuardrailAutomatedReasoningTranslationOptionList, 0], [() => GuardrailAutomatedReasoningDifferenceScenarioList, 0]]
  ], GuardrailAutomatedReasoningTranslationOption$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTranslationOption",
    0,
    ["translations"],
    [[() => GuardrailAutomatedReasoningTranslationList, 0]]
  ], GuardrailAutomatedReasoningValidFinding$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningValidFinding",
    0,
    ["translation", "claimsTrueScenario", "supportingRules", "logicWarning"],
    [[() => GuardrailAutomatedReasoningTranslation$, 0], [() => GuardrailAutomatedReasoningScenario$, 0], () => GuardrailAutomatedReasoningRuleList, [() => GuardrailAutomatedReasoningLogicWarning$, 0]]
  ], GuardrailConfiguration$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailConfiguration",
    0,
    ["guardrailIdentifier", "guardrailVersion", "trace"],
    [0, 0, 0]
  ], GuardrailContentFilter$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailContentFilter",
    0,
    ["type", "confidence", "action", "filterStrength", "detected"],
    [0, 0, 0, 0, 2],
    3
  ], GuardrailContentPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailContentPolicyAssessment",
    0,
    ["filters"],
    [() => GuardrailContentFilterList],
    1
  ], GuardrailContextualGroundingFilter$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailContextualGroundingFilter",
    0,
    ["type", "threshold", "score", "action", "detected"],
    [0, 1, 1, 0, 2],
    4
  ], GuardrailContextualGroundingPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailContextualGroundingPolicyAssessment",
    0,
    ["filters"],
    [() => GuardrailContextualGroundingFilters2]
  ], GuardrailConverseImageBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailConverseImageBlock",
    8,
    ["format", "source"],
    [0, [() => GuardrailConverseImageSource$, 0]],
    2
  ], GuardrailConverseTextBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailConverseTextBlock",
    0,
    ["text", "qualifiers"],
    [0, 64],
    1
  ], GuardrailCoverage$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailCoverage",
    0,
    ["textCharacters", "images"],
    [() => GuardrailTextCharactersCoverage$, () => GuardrailImageCoverage$]
  ], GuardrailCustomWord$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailCustomWord",
    0,
    ["match", "action", "detected"],
    [0, 0, 2],
    2
  ], GuardrailImageBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailImageBlock",
    8,
    ["format", "source"],
    [0, [() => GuardrailImageSource$, 0]],
    2
  ], GuardrailImageCoverage$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailImageCoverage",
    0,
    ["guarded", "total"],
    [1, 1]
  ], GuardrailInvocationMetrics$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailInvocationMetrics",
    0,
    ["guardrailProcessingLatency", "usage", "guardrailCoverage"],
    [1, () => GuardrailUsage$, () => GuardrailCoverage$]
  ], GuardrailManagedWord$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailManagedWord",
    0,
    ["match", "type", "action", "detected"],
    [0, 0, 0, 2],
    3
  ], GuardrailOutputContent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailOutputContent",
    0,
    ["text"],
    [0]
  ], GuardrailPiiEntityFilter$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailPiiEntityFilter",
    0,
    ["match", "type", "action", "detected"],
    [0, 0, 0, 2],
    3
  ], GuardrailRegexFilter$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailRegexFilter",
    0,
    ["action", "name", "match", "regex", "detected"],
    [0, 0, 0, 0, 2],
    1
  ], GuardrailSensitiveInformationPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailSensitiveInformationPolicyAssessment",
    0,
    ["piiEntities", "regexes"],
    [() => GuardrailPiiEntityFilterList, () => GuardrailRegexFilterList],
    2
  ], GuardrailStreamConfiguration$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailStreamConfiguration",
    0,
    ["guardrailIdentifier", "guardrailVersion", "trace", "streamProcessingMode"],
    [0, 0, 0, 0]
  ], GuardrailTextBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailTextBlock",
    0,
    ["text", "qualifiers"],
    [0, 64],
    1
  ], GuardrailTextCharactersCoverage$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailTextCharactersCoverage",
    0,
    ["guarded", "total"],
    [1, 1]
  ], GuardrailTopic$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailTopic",
    0,
    ["name", "type", "action", "detected"],
    [0, 0, 0, 2],
    3
  ], GuardrailTopicPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailTopicPolicyAssessment",
    0,
    ["topics"],
    [() => GuardrailTopicList],
    1
  ], GuardrailTraceAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailTraceAssessment",
    0,
    ["modelOutput", "inputAssessment", "outputAssessments", "actionReason"],
    [64, [() => GuardrailAssessmentMap, 0], [() => GuardrailAssessmentListMap, 0], 0]
  ], GuardrailUsage$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailUsage",
    0,
    ["topicPolicyUnits", "contentPolicyUnits", "wordPolicyUnits", "sensitiveInformationPolicyUnits", "sensitiveInformationPolicyFreeUnits", "contextualGroundingPolicyUnits", "contentPolicyImageUnits", "automatedReasoningPolicyUnits", "automatedReasoningPolicies"],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    6
  ], GuardrailWordPolicyAssessment$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "GuardrailWordPolicyAssessment",
    0,
    ["customWords", "managedWordLists"],
    [() => GuardrailCustomWordList, () => GuardrailManagedWordList],
    2
  ], ImageBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ImageBlock",
    0,
    ["format", "source", "error"],
    [0, [() => ImageSource$, 0], [() => ErrorBlock$, 0]],
    2
  ], ImageBlockDelta$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ImageBlockDelta",
    0,
    ["source", "error"],
    [[() => ImageSource$, 0], [() => ErrorBlock$, 0]]
  ], ImageBlockStart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ImageBlockStart",
    0,
    ["format"],
    [0],
    1
  ], InferenceConfiguration$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InferenceConfiguration",
    0,
    ["maxTokens", "temperature", "topP", "stopSequences"],
    [1, 1, 1, 64]
  ], InvokeModelRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelRequest",
    0,
    ["modelId", "body", "contentType", "accept", "trace", "guardrailIdentifier", "guardrailVersion", "performanceConfigLatency", "serviceTier"],
    [[0, 1], [() => Body, 16], [0, { ["httpHeader"]: "Content-Type" }], [0, { ["httpHeader"]: "Accept" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Trace" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-GuardrailIdentifier" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-GuardrailVersion" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-PerformanceConfig-Latency" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Service-Tier" }]],
    1
  ], InvokeModelResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelResponse",
    0,
    ["body", "contentType", "performanceConfigLatency", "serviceTier"],
    [[() => Body, 16], [0, { ["httpHeader"]: "Content-Type" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-PerformanceConfig-Latency" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Service-Tier" }]],
    2
  ], InvokeModelTokensRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelTokensRequest",
    0,
    ["body"],
    [[() => Body, 0]],
    1
  ], InvokeModelWithBidirectionalStreamRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithBidirectionalStreamRequest",
    0,
    ["modelId", "body"],
    [[0, 1], [() => InvokeModelWithBidirectionalStreamInput$, 16]],
    2
  ], InvokeModelWithBidirectionalStreamResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithBidirectionalStreamResponse",
    0,
    ["body"],
    [[() => InvokeModelWithBidirectionalStreamOutput$, 16]],
    1
  ], InvokeModelWithResponseStreamRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithResponseStreamRequest",
    0,
    ["modelId", "body", "contentType", "accept", "trace", "guardrailIdentifier", "guardrailVersion", "performanceConfigLatency", "serviceTier"],
    [[0, 1], [() => Body, 16], [0, { ["httpHeader"]: "Content-Type" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Accept" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Trace" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-GuardrailIdentifier" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-GuardrailVersion" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-PerformanceConfig-Latency" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Service-Tier" }]],
    1
  ], InvokeModelWithResponseStreamResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithResponseStreamResponse",
    0,
    ["body", "contentType", "performanceConfigLatency", "serviceTier"],
    [[() => ResponseStream$, 16], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Content-Type" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-PerformanceConfig-Latency" }], [0, { ["httpHeader"]: "X-Amzn-Bedrock-Service-Tier" }]],
    2
  ], JsonSchemaDefinition$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "JsonSchemaDefinition",
    0,
    ["schema", "name", "description"],
    [0, 0, 0],
    1
  ], ListAsyncInvokesRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ListAsyncInvokesRequest",
    0,
    ["submitTimeAfter", "submitTimeBefore", "statusEquals", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "submitTimeAfter" }], [5, { ["httpQuery"]: "submitTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListAsyncInvokesResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ListAsyncInvokesResponse",
    0,
    ["nextToken", "asyncInvokeSummaries"],
    [0, [() => AsyncInvokeSummaries, 0]]
  ], Message$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "Message",
    0,
    ["role", "content"],
    [0, [() => ContentBlocks, 0]],
    2
  ], MessageStartEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "MessageStartEvent",
    0,
    ["role"],
    [0],
    1
  ], MessageStopEvent$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "MessageStopEvent",
    0,
    ["stopReason", "additionalModelResponseFields"],
    [0, 15],
    1
  ], OutputConfig$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "OutputConfig",
    0,
    ["textFormat"],
    [[() => OutputFormat$, 0]]
  ], OutputFormat$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "OutputFormat",
    0,
    ["type", "structure"],
    [0, [() => OutputFormatStructure$, 0]],
    2
  ], PayloadPart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "PayloadPart",
    8,
    ["bytes"],
    [[() => PartBody, 0]]
  ], PerformanceConfiguration$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "PerformanceConfiguration",
    0,
    ["latency"],
    [0]
  ], PromptRouterTrace$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "PromptRouterTrace",
    0,
    ["invokedModelId"],
    [0]
  ], ReasoningTextBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ReasoningTextBlock",
    8,
    ["text", "signature"],
    [0, 0],
    1
  ], S3Location$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "S3Location",
    0,
    ["uri", "bucketOwner"],
    [0, 0],
    1
  ], SearchResultBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "SearchResultBlock",
    0,
    ["source", "title", "content", "citations"],
    [0, 0, () => SearchResultContentBlocks, () => CitationsConfig$],
    3
  ], SearchResultContentBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "SearchResultContentBlock",
    0,
    ["text"],
    [0],
    1
  ], SearchResultLocation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "SearchResultLocation",
    0,
    ["searchResultIndex", "start", "end"],
    [1, 1, 1]
  ], ServiceTier$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ServiceTier",
    0,
    ["type"],
    [0],
    1
  ], SpecificToolChoice$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "SpecificToolChoice",
    0,
    ["name"],
    [0],
    1
  ], StartAsyncInvokeRequest$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "StartAsyncInvokeRequest",
    0,
    ["modelId", "modelInput", "outputDataConfig", "clientRequestToken", "tags"],
    [0, [() => ModelInputPayload, 0], () => AsyncInvokeOutputDataConfig$, [0, 4], () => TagList2],
    3
  ], StartAsyncInvokeResponse$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "StartAsyncInvokeResponse",
    0,
    ["invocationArn"],
    [0],
    1
  ], SystemTool$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "SystemTool",
    0,
    ["name"],
    [0],
    1
  ], Tag$2 = [
    3,
    "com.amazonaws.bedrockruntime",
    "Tag",
    0,
    ["key", "value"],
    [0, 0],
    2
  ], TokenUsage$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "TokenUsage",
    0,
    ["inputTokens", "outputTokens", "totalTokens", "cacheReadInputTokens", "cacheWriteInputTokens", "cacheDetails"],
    [1, 1, 1, 1, 1, () => CacheDetailsList],
    3
  ], ToolConfiguration$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolConfiguration",
    0,
    ["tools", "toolChoice"],
    [() => Tools, () => ToolChoice$],
    1
  ], ToolResultBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolResultBlock",
    0,
    ["toolUseId", "content", "status", "type"],
    [0, [() => ToolResultContentBlocks, 0], 0, 0],
    2
  ], ToolResultBlockStart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolResultBlockStart",
    0,
    ["toolUseId", "type", "status"],
    [0, 0, 0],
    1
  ], ToolSpecification$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolSpecification",
    0,
    ["name", "inputSchema", "description", "strict"],
    [0, () => ToolInputSchema$, 0, 2],
    2
  ], ToolUseBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolUseBlock",
    0,
    ["toolUseId", "name", "input", "type"],
    [0, 0, 15, 0],
    3
  ], ToolUseBlockDelta$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolUseBlockDelta",
    0,
    ["input"],
    [0],
    1
  ], ToolUseBlockStart$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "ToolUseBlockStart",
    0,
    ["toolUseId", "name", "type"],
    [0, 0, 0],
    2
  ], VideoBlock$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "VideoBlock",
    0,
    ["format", "source"],
    [0, () => VideoSource$],
    2
  ], WebLocation$ = [
    3,
    "com.amazonaws.bedrockruntime",
    "WebLocation",
    0,
    ["url", "domain"],
    [0, 0]
  ], AsyncInvokeSummaries = [
    1,
    "com.amazonaws.bedrockruntime",
    "AsyncInvokeSummaries",
    0,
    [
      () => AsyncInvokeSummary$,
      0
    ]
  ], CacheDetailsList = [
    1,
    "com.amazonaws.bedrockruntime",
    "CacheDetailsList",
    0,
    () => CacheDetail$
  ], CitationGeneratedContentList = [
    1,
    "com.amazonaws.bedrockruntime",
    "CitationGeneratedContentList",
    0,
    () => CitationGeneratedContent$
  ], Citations = [
    1,
    "com.amazonaws.bedrockruntime",
    "Citations",
    0,
    () => Citation$
  ], CitationSourceContentList = [
    1,
    "com.amazonaws.bedrockruntime",
    "CitationSourceContentList",
    0,
    () => CitationSourceContent$
  ], CitationSourceContentListDelta = [
    1,
    "com.amazonaws.bedrockruntime",
    "CitationSourceContentListDelta",
    0,
    () => CitationSourceContentDelta$
  ], ContentBlocks = [
    1,
    "com.amazonaws.bedrockruntime",
    "ContentBlocks",
    0,
    [
      () => ContentBlock$,
      0
    ]
  ], DocumentContentBlocks = [
    1,
    "com.amazonaws.bedrockruntime",
    "DocumentContentBlocks",
    0,
    () => DocumentContentBlock$
  ], GuardrailAssessmentList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAssessmentList",
    0,
    [
      () => GuardrailAssessment$,
      0
    ]
  ], GuardrailAutomatedReasoningDifferenceScenarioList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningDifferenceScenarioList",
    0,
    [
      () => GuardrailAutomatedReasoningScenario$,
      0
    ]
  ], GuardrailAutomatedReasoningFindingList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningFindingList",
    0,
    [
      () => GuardrailAutomatedReasoningFinding$,
      0
    ]
  ], GuardrailAutomatedReasoningInputTextReferenceList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningInputTextReferenceList",
    0,
    [
      () => GuardrailAutomatedReasoningInputTextReference$,
      0
    ]
  ], GuardrailAutomatedReasoningRuleList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningRuleList",
    0,
    () => GuardrailAutomatedReasoningRule$
  ], GuardrailAutomatedReasoningStatementList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningStatementList",
    0,
    [
      () => GuardrailAutomatedReasoningStatement$,
      0
    ]
  ], GuardrailAutomatedReasoningTranslationList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTranslationList",
    0,
    [
      () => GuardrailAutomatedReasoningTranslation$,
      0
    ]
  ], GuardrailAutomatedReasoningTranslationOptionList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningTranslationOptionList",
    0,
    [
      () => GuardrailAutomatedReasoningTranslationOption$,
      0
    ]
  ], GuardrailContentBlockList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailContentBlockList",
    0,
    [
      () => GuardrailContentBlock$,
      0
    ]
  ], GuardrailContentFilterList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailContentFilterList",
    0,
    () => GuardrailContentFilter$2
  ], GuardrailContextualGroundingFilters2 = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailContextualGroundingFilters",
    0,
    () => GuardrailContextualGroundingFilter$2
  ], GuardrailCustomWordList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailCustomWordList",
    0,
    () => GuardrailCustomWord$
  ], GuardrailManagedWordList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailManagedWordList",
    0,
    () => GuardrailManagedWord$
  ], GuardrailOutputContentList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailOutputContentList",
    0,
    () => GuardrailOutputContent$
  ], GuardrailPiiEntityFilterList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailPiiEntityFilterList",
    0,
    () => GuardrailPiiEntityFilter$
  ], GuardrailRegexFilterList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailRegexFilterList",
    0,
    () => GuardrailRegexFilter$
  ], GuardrailTopicList = [
    1,
    "com.amazonaws.bedrockruntime",
    "GuardrailTopicList",
    0,
    () => GuardrailTopic$2
  ], Messages3 = [
    1,
    "com.amazonaws.bedrockruntime",
    "Messages",
    0,
    [
      () => Message$,
      0
    ]
  ], SearchResultContentBlocks = [
    1,
    "com.amazonaws.bedrockruntime",
    "SearchResultContentBlocks",
    0,
    () => SearchResultContentBlock$
  ], SystemContentBlocks = [
    1,
    "com.amazonaws.bedrockruntime",
    "SystemContentBlocks",
    0,
    [
      () => SystemContentBlock$,
      0
    ]
  ], TagList2 = [
    1,
    "com.amazonaws.bedrockruntime",
    "TagList",
    0,
    () => Tag$2
  ], ToolResultBlocksDelta = [
    1,
    "com.amazonaws.bedrockruntime",
    "ToolResultBlocksDelta",
    0,
    () => ToolResultBlockDelta$
  ], ToolResultContentBlocks = [
    1,
    "com.amazonaws.bedrockruntime",
    "ToolResultContentBlocks",
    0,
    [
      () => ToolResultContentBlock$,
      0
    ]
  ], Tools = [
    1,
    "com.amazonaws.bedrockruntime",
    "Tools",
    0,
    () => Tool$
  ], GuardrailAssessmentListMap = [
    2,
    "com.amazonaws.bedrockruntime",
    "GuardrailAssessmentListMap",
    0,
    [
      0,
      0
    ],
    [
      () => GuardrailAssessmentList,
      0
    ]
  ], GuardrailAssessmentMap = [
    2,
    "com.amazonaws.bedrockruntime",
    "GuardrailAssessmentMap",
    0,
    [
      0,
      0
    ],
    [
      () => GuardrailAssessment$,
      0
    ]
  ], PromptVariableMap = [
    2,
    "com.amazonaws.bedrockruntime",
    "PromptVariableMap",
    8,
    0,
    () => PromptVariableValues$
  ], RequestMetadata = [
    2,
    "com.amazonaws.bedrockruntime",
    "RequestMetadata",
    8,
    0,
    0
  ], AsyncInvokeOutputDataConfig$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "AsyncInvokeOutputDataConfig",
    0,
    ["s3OutputDataConfig"],
    [() => AsyncInvokeS3OutputDataConfig$]
  ], AudioSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "AudioSource",
    8,
    ["bytes", "s3Location"],
    [21, () => S3Location$]
  ], CitationGeneratedContent$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "CitationGeneratedContent",
    0,
    ["text"],
    [0]
  ], CitationLocation$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "CitationLocation",
    0,
    ["web", "documentChar", "documentPage", "documentChunk", "searchResultLocation"],
    [() => WebLocation$, () => DocumentCharLocation$, () => DocumentPageLocation$, () => DocumentChunkLocation$, () => SearchResultLocation$]
  ], CitationSourceContent$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "CitationSourceContent",
    0,
    ["text"],
    [0]
  ], ContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ContentBlock",
    0,
    ["text", "image", "document", "video", "audio", "toolUse", "toolResult", "guardContent", "cachePoint", "reasoningContent", "citationsContent", "searchResult"],
    [0, [() => ImageBlock$, 0], () => DocumentBlock$, () => VideoBlock$, [() => AudioBlock$, 0], () => ToolUseBlock$, [() => ToolResultBlock$, 0], [() => GuardrailConverseContentBlock$, 0], () => CachePointBlock$, [() => ReasoningContentBlock$, 0], () => CitationsContentBlock$, () => SearchResultBlock$]
  ], ContentBlockDelta$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ContentBlockDelta",
    0,
    ["text", "toolUse", "toolResult", "reasoningContent", "citation", "image"],
    [0, () => ToolUseBlockDelta$, () => ToolResultBlocksDelta, [() => ReasoningContentBlockDelta$, 0], () => CitationsDelta$, [() => ImageBlockDelta$, 0]]
  ], ContentBlockStart$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ContentBlockStart",
    0,
    ["toolUse", "toolResult", "image"],
    [() => ToolUseBlockStart$, () => ToolResultBlockStart$, () => ImageBlockStart$]
  ], ConverseOutput$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ConverseOutput",
    0,
    ["message"],
    [[() => Message$, 0]]
  ], ConverseStreamOutput$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ConverseStreamOutput",
    { ["streaming"]: 1 },
    ["messageStart", "contentBlockStart", "contentBlockDelta", "contentBlockStop", "messageStop", "metadata", "internalServerException", "modelStreamErrorException", "validationException", "throttlingException", "serviceUnavailableException"],
    [() => MessageStartEvent$, () => ContentBlockStartEvent$, [() => ContentBlockDeltaEvent$, 0], () => ContentBlockStopEvent$, () => MessageStopEvent$, [() => ConverseStreamMetadataEvent$, 0], [() => InternalServerException$2, 0], [() => ModelStreamErrorException$, 0], [() => ValidationException$2, 0], [() => ThrottlingException$2, 0], [() => ServiceUnavailableException$2, 0]]
  ], CountTokensInput$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "CountTokensInput",
    0,
    ["invokeModel", "converse"],
    [[() => InvokeModelTokensRequest$, 0], [() => ConverseTokensRequest$, 0]]
  ], DocumentContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "DocumentContentBlock",
    0,
    ["text"],
    [0]
  ], DocumentSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "DocumentSource",
    0,
    ["bytes", "s3Location", "text", "content"],
    [21, () => S3Location$, 0, () => DocumentContentBlocks]
  ], GuardrailAutomatedReasoningFinding$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "GuardrailAutomatedReasoningFinding",
    0,
    ["valid", "invalid", "satisfiable", "impossible", "translationAmbiguous", "tooComplex", "noTranslations"],
    [[() => GuardrailAutomatedReasoningValidFinding$, 0], [() => GuardrailAutomatedReasoningInvalidFinding$, 0], [() => GuardrailAutomatedReasoningSatisfiableFinding$, 0], [() => GuardrailAutomatedReasoningImpossibleFinding$, 0], [() => GuardrailAutomatedReasoningTranslationAmbiguousFinding$, 0], () => GuardrailAutomatedReasoningTooComplexFinding$, () => GuardrailAutomatedReasoningNoTranslationsFinding$]
  ], GuardrailContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "GuardrailContentBlock",
    0,
    ["text", "image"],
    [() => GuardrailTextBlock$, [() => GuardrailImageBlock$, 0]]
  ], GuardrailConverseContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "GuardrailConverseContentBlock",
    0,
    ["text", "image"],
    [() => GuardrailConverseTextBlock$, [() => GuardrailConverseImageBlock$, 0]]
  ], GuardrailConverseImageSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "GuardrailConverseImageSource",
    8,
    ["bytes"],
    [21]
  ], GuardrailImageSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "GuardrailImageSource",
    8,
    ["bytes"],
    [21]
  ], ImageSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ImageSource",
    8,
    ["bytes", "s3Location"],
    [21, () => S3Location$]
  ], InvokeModelWithBidirectionalStreamInput$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithBidirectionalStreamInput",
    { ["streaming"]: 1 },
    ["chunk"],
    [[() => BidirectionalInputPayloadPart$, 0]]
  ], InvokeModelWithBidirectionalStreamOutput$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithBidirectionalStreamOutput",
    { ["streaming"]: 1 },
    ["chunk", "internalServerException", "modelStreamErrorException", "validationException", "throttlingException", "modelTimeoutException", "serviceUnavailableException"],
    [[() => BidirectionalOutputPayloadPart$, 0], [() => InternalServerException$2, 0], [() => ModelStreamErrorException$, 0], [() => ValidationException$2, 0], [() => ThrottlingException$2, 0], [() => ModelTimeoutException$, 0], [() => ServiceUnavailableException$2, 0]]
  ], OutputFormatStructure$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "OutputFormatStructure",
    8,
    ["jsonSchema"],
    [() => JsonSchemaDefinition$]
  ], PromptVariableValues$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "PromptVariableValues",
    0,
    ["text"],
    [0]
  ], ReasoningContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ReasoningContentBlock",
    8,
    ["reasoningText", "redactedContent"],
    [[() => ReasoningTextBlock$, 0], 21]
  ], ReasoningContentBlockDelta$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ReasoningContentBlockDelta",
    8,
    ["text", "redactedContent", "signature"],
    [0, 21, 0]
  ], ResponseStream$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ResponseStream",
    { ["streaming"]: 1 },
    ["chunk", "internalServerException", "modelStreamErrorException", "validationException", "throttlingException", "modelTimeoutException", "serviceUnavailableException"],
    [[() => PayloadPart$, 0], [() => InternalServerException$2, 0], [() => ModelStreamErrorException$, 0], [() => ValidationException$2, 0], [() => ThrottlingException$2, 0], [() => ModelTimeoutException$, 0], [() => ServiceUnavailableException$2, 0]]
  ], SystemContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "SystemContentBlock",
    0,
    ["text", "guardContent", "cachePoint"],
    [0, [() => GuardrailConverseContentBlock$, 0], () => CachePointBlock$]
  ], Tool$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "Tool",
    0,
    ["toolSpec", "systemTool", "cachePoint"],
    [() => ToolSpecification$, () => SystemTool$, () => CachePointBlock$]
  ], ToolChoice$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ToolChoice",
    0,
    ["auto", "any", "tool"],
    [() => AutoToolChoice$, () => AnyToolChoice$, () => SpecificToolChoice$]
  ], ToolInputSchema$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ToolInputSchema",
    0,
    ["json"],
    [15]
  ], ToolResultBlockDelta$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ToolResultBlockDelta",
    0,
    ["text", "json"],
    [0, 15]
  ], ToolResultContentBlock$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "ToolResultContentBlock",
    0,
    ["json", "text", "image", "document", "video", "searchResult"],
    [15, 0, [() => ImageBlock$, 0], () => DocumentBlock$, () => VideoBlock$, () => SearchResultBlock$]
  ], VideoSource$ = [
    4,
    "com.amazonaws.bedrockruntime",
    "VideoSource",
    0,
    ["bytes", "s3Location"],
    [21, () => S3Location$]
  ], ApplyGuardrail$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "ApplyGuardrail",
    { ["http"]: ["POST", "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply", 200] },
    () => ApplyGuardrailRequest$,
    () => ApplyGuardrailResponse$
  ], Converse$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "Converse",
    { ["http"]: ["POST", "/model/{modelId}/converse", 200] },
    () => ConverseRequest$,
    () => ConverseResponse$
  ], ConverseStream$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "ConverseStream",
    { ["http"]: ["POST", "/model/{modelId}/converse-stream", 200] },
    () => ConverseStreamRequest$,
    () => ConverseStreamResponse$
  ], CountTokens$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "CountTokens",
    { ["http"]: ["POST", "/model/{modelId}/count-tokens", 200] },
    () => CountTokensRequest$,
    () => CountTokensResponse$
  ], GetAsyncInvoke$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "GetAsyncInvoke",
    { ["http"]: ["GET", "/async-invoke/{invocationArn}", 200] },
    () => GetAsyncInvokeRequest$,
    () => GetAsyncInvokeResponse$
  ], InvokeModel$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "InvokeModel",
    { ["http"]: ["POST", "/model/{modelId}/invoke", 200] },
    () => InvokeModelRequest$,
    () => InvokeModelResponse$
  ], InvokeModelWithBidirectionalStream$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithBidirectionalStream",
    { ["http"]: ["POST", "/model/{modelId}/invoke-with-bidirectional-stream", 200] },
    () => InvokeModelWithBidirectionalStreamRequest$,
    () => InvokeModelWithBidirectionalStreamResponse$
  ], InvokeModelWithResponseStream$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "InvokeModelWithResponseStream",
    { ["http"]: ["POST", "/model/{modelId}/invoke-with-response-stream", 200] },
    () => InvokeModelWithResponseStreamRequest$,
    () => InvokeModelWithResponseStreamResponse$
  ], ListAsyncInvokes$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "ListAsyncInvokes",
    { ["http"]: ["GET", "/async-invoke", 200] },
    () => ListAsyncInvokesRequest$,
    () => ListAsyncInvokesResponse$
  ], StartAsyncInvoke$ = [
    9,
    "com.amazonaws.bedrockruntime",
    "StartAsyncInvoke",
    { ["http"]: ["POST", "/async-invoke", 200] },
    () => StartAsyncInvokeRequest$,
    () => StartAsyncInvokeResponse$
  ];
});

// var: init_schemas_0
var init_schemas_0 = __esm(() => {
  init_BedrockServiceException();
  init_errors4();
  import_schema3 = __toESM(require_schema(), 1), _s_registry = import_schema3.TypeRegistry.for("smithy.ts.sdk.synthetic.com.amazonaws.bedrock"), BedrockServiceException$ = [-3, "smithy.ts.sdk.synthetic.com.amazonaws.bedrock", "BedrockServiceException", 0, [], []];
  _s_registry.registerError(BedrockServiceException$, BedrockServiceException);
  n0_registry = import_schema3.TypeRegistry.for("com.amazonaws.bedrock"), AccessDeniedException$ = [
    -3,
    "com.amazonaws.bedrock",
    "AccessDeniedException",
    { ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(AccessDeniedException$, AccessDeniedException);
  ConflictException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ConflictException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ConflictException$, ConflictException);
  InternalServerException$ = [
    -3,
    "com.amazonaws.bedrock",
    "InternalServerException",
    { ["error"]: "server", ["httpError"]: 500 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(InternalServerException$, InternalServerException);
  ResourceInUseException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ResourceInUseException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ResourceInUseException$, ResourceInUseException);
  ResourceNotFoundException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ResourceNotFoundException",
    { ["error"]: "client", ["httpError"]: 404 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ResourceNotFoundException$, ResourceNotFoundException);
  ServiceQuotaExceededException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ServiceQuotaExceededException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ServiceQuotaExceededException$, ServiceQuotaExceededException);
  ServiceUnavailableException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ServiceUnavailableException",
    { ["error"]: "server", ["httpError"]: 503 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ServiceUnavailableException$, ServiceUnavailableException);
  ThrottlingException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ThrottlingException",
    { ["error"]: "client", ["httpError"]: 429 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ThrottlingException$, ThrottlingException);
  TooManyTagsException$ = [
    -3,
    "com.amazonaws.bedrock",
    "TooManyTagsException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message", "resourceName"],
    [0, 0]
  ];
  n0_registry.registerError(TooManyTagsException$, TooManyTagsException);
  ValidationException$ = [
    -3,
    "com.amazonaws.bedrock",
    "ValidationException",
    { ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry.registerError(ValidationException$, ValidationException);
  errorTypeRegistries = [
    _s_registry,
    n0_registry
  ], AutomatedReasoningLogicStatementContent = [0, "com.amazonaws.bedrock", "AutomatedReasoningLogicStatementContent", 8, 0], AutomatedReasoningNaturalLanguageStatementContent = [0, "com.amazonaws.bedrock", "AutomatedReasoningNaturalLanguageStatementContent", 8, 0], AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage", 8, 0], AutomatedReasoningPolicyAnnotationIngestContent = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyAnnotationIngestContent", 8, 0], AutomatedReasoningPolicyAnnotationRuleNaturalLanguage = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyAnnotationRuleNaturalLanguage", 8, 0], AutomatedReasoningPolicyBuildDocumentBlob = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyBuildDocumentBlob", 8, 21], AutomatedReasoningPolicyBuildDocumentDescription = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyBuildDocumentDescription", 8, 0], AutomatedReasoningPolicyBuildDocumentName = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyBuildDocumentName", 8, 0], AutomatedReasoningPolicyBuildResultAssetName = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyBuildResultAssetName", 8, 0], AutomatedReasoningPolicyDefinitionRuleAlternateExpression = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionRuleAlternateExpression", 8, 0], AutomatedReasoningPolicyDefinitionRuleExpression = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionRuleExpression", 8, 0], AutomatedReasoningPolicyDefinitionTypeDescription = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionTypeDescription", 8, 0], AutomatedReasoningPolicyDefinitionTypeName = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionTypeName", 8, 0], AutomatedReasoningPolicyDefinitionTypeValueDescription = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionTypeValueDescription", 8, 0], AutomatedReasoningPolicyDefinitionVariableDescription = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionVariableDescription", 8, 0], AutomatedReasoningPolicyDefinitionVariableName = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDefinitionVariableName", 8, 0], AutomatedReasoningPolicyDescription = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyDescription", 8, 0], AutomatedReasoningPolicyJustificationText = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyJustificationText", 8, 0], AutomatedReasoningPolicyLineText = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyLineText", 8, 0], AutomatedReasoningPolicyName = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyName", 8, 0], AutomatedReasoningPolicyScenarioAlternateExpression = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyScenarioAlternateExpression", 8, 0], AutomatedReasoningPolicyScenarioExpression = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyScenarioExpression", 8, 0], AutomatedReasoningPolicyStatementText = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyStatementText", 8, 0], AutomatedReasoningPolicyTestGuardContent = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyTestGuardContent", 8, 0], AutomatedReasoningPolicyTestQueryContent = [0, "com.amazonaws.bedrock", "AutomatedReasoningPolicyTestQueryContent", 8, 0], ByteContentBlob = [0, "com.amazonaws.bedrock", "ByteContentBlob", 8, 21], EvaluationDatasetName = [0, "com.amazonaws.bedrock", "EvaluationDatasetName", 8, 0], EvaluationJobDescription = [0, "com.amazonaws.bedrock", "EvaluationJobDescription", 8, 0], EvaluationJobIdentifier = [0, "com.amazonaws.bedrock", "EvaluationJobIdentifier", 8, 0], EvaluationMetricDescription = [0, "com.amazonaws.bedrock", "EvaluationMetricDescription", 8, 0], EvaluationMetricName = [0, "com.amazonaws.bedrock", "EvaluationMetricName", 8, 0], EvaluationModelInferenceParams = [0, "com.amazonaws.bedrock", "EvaluationModelInferenceParams", 8, 0], GuardrailBlockedMessaging = [0, "com.amazonaws.bedrock", "GuardrailBlockedMessaging", 8, 0], GuardrailContentFilterAction = [0, "com.amazonaws.bedrock", "GuardrailContentFilterAction", 8, 0], GuardrailContentFiltersTierName = [0, "com.amazonaws.bedrock", "GuardrailContentFiltersTierName", 8, 0], GuardrailContextualGroundingAction = [0, "com.amazonaws.bedrock", "GuardrailContextualGroundingAction", 8, 0], GuardrailDescription = [0, "com.amazonaws.bedrock", "GuardrailDescription", 8, 0], GuardrailFailureRecommendation = [0, "com.amazonaws.bedrock", "GuardrailFailureRecommendation", 8, 0], GuardrailModality = [0, "com.amazonaws.bedrock", "GuardrailModality", 8, 0], GuardrailName = [0, "com.amazonaws.bedrock", "GuardrailName", 8, 0], GuardrailStatusReason = [0, "com.amazonaws.bedrock", "GuardrailStatusReason", 8, 0], GuardrailTopicAction = [0, "com.amazonaws.bedrock", "GuardrailTopicAction", 8, 0], GuardrailTopicDefinition = [0, "com.amazonaws.bedrock", "GuardrailTopicDefinition", 8, 0], GuardrailTopicExample = [0, "com.amazonaws.bedrock", "GuardrailTopicExample", 8, 0], GuardrailTopicName = [0, "com.amazonaws.bedrock", "GuardrailTopicName", 8, 0], GuardrailTopicsTierName = [0, "com.amazonaws.bedrock", "GuardrailTopicsTierName", 8, 0], GuardrailWordAction = [0, "com.amazonaws.bedrock", "GuardrailWordAction", 8, 0], HumanTaskInstructions = [0, "com.amazonaws.bedrock", "HumanTaskInstructions", 8, 0], Identifier = [0, "com.amazonaws.bedrock", "Identifier", 8, 0], InferenceProfileDescription = [0, "com.amazonaws.bedrock", "InferenceProfileDescription", 8, 0], Message = [0, "com.amazonaws.bedrock", "Message", 8, 0], MetricName = [0, "com.amazonaws.bedrock", "MetricName", 8, 0], PromptRouterDescription = [0, "com.amazonaws.bedrock", "PromptRouterDescription", 8, 0], TextPromptTemplate = [0, "com.amazonaws.bedrock", "TextPromptTemplate", 8, 0], AccountEnforcedGuardrailInferenceInputConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "AccountEnforcedGuardrailInferenceInputConfiguration",
    0,
    ["guardrailIdentifier", "guardrailVersion", "selectiveContentGuarding", "modelEnforcement"],
    [0, 0, () => SelectiveContentGuarding$, () => ModelEnforcement$],
    2
  ], AccountEnforcedGuardrailOutputConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "AccountEnforcedGuardrailOutputConfiguration",
    0,
    ["configId", "guardrailArn", "guardrailId", "inputTags", "selectiveContentGuarding", "guardrailVersion", "createdAt", "createdBy", "updatedAt", "updatedBy", "owner", "modelEnforcement"],
    [0, 0, 0, 0, () => SelectiveContentGuarding$, 0, 5, 0, 5, 0, 0, () => ModelEnforcement$]
  ], AgreementAvailability$ = [
    3,
    "com.amazonaws.bedrock",
    "AgreementAvailability",
    0,
    ["status", "errorMessage"],
    [0, 0],
    1
  ], AutomatedEvaluationConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedEvaluationConfig",
    0,
    ["datasetMetricConfigs", "evaluatorModelConfig", "customMetricConfig"],
    [[() => EvaluationDatasetMetricConfigs, 0], () => EvaluatorModelConfig$, [() => AutomatedEvaluationCustomMetricConfig$, 0]],
    1
  ], AutomatedEvaluationCustomMetricConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedEvaluationCustomMetricConfig",
    0,
    ["customMetrics", "evaluatorModelConfig"],
    [[() => AutomatedEvaluationCustomMetrics, 0], () => CustomMetricEvaluatorModelConfig$],
    2
  ], AutomatedReasoningCheckImpossibleFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckImpossibleFinding",
    0,
    ["translation", "contradictingRules", "logicWarning"],
    [[() => AutomatedReasoningCheckTranslation$, 0], () => AutomatedReasoningCheckRuleList, [() => AutomatedReasoningCheckLogicWarning$, 0]]
  ], AutomatedReasoningCheckInputTextReference$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckInputTextReference",
    0,
    ["text"],
    [[() => AutomatedReasoningNaturalLanguageStatementContent, 0]]
  ], AutomatedReasoningCheckInvalidFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckInvalidFinding",
    0,
    ["translation", "contradictingRules", "logicWarning"],
    [[() => AutomatedReasoningCheckTranslation$, 0], () => AutomatedReasoningCheckRuleList, [() => AutomatedReasoningCheckLogicWarning$, 0]]
  ], AutomatedReasoningCheckLogicWarning$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckLogicWarning",
    0,
    ["type", "premises", "claims"],
    [0, [() => AutomatedReasoningLogicStatementList, 0], [() => AutomatedReasoningLogicStatementList, 0]]
  ], AutomatedReasoningCheckNoTranslationsFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckNoTranslationsFinding",
    0,
    [],
    []
  ], AutomatedReasoningCheckRule$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckRule",
    0,
    ["id", "policyVersionArn"],
    [0, 0]
  ], AutomatedReasoningCheckSatisfiableFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckSatisfiableFinding",
    0,
    ["translation", "claimsTrueScenario", "claimsFalseScenario", "logicWarning"],
    [[() => AutomatedReasoningCheckTranslation$, 0], [() => AutomatedReasoningCheckScenario$, 0], [() => AutomatedReasoningCheckScenario$, 0], [() => AutomatedReasoningCheckLogicWarning$, 0]]
  ], AutomatedReasoningCheckScenario$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckScenario",
    0,
    ["statements"],
    [[() => AutomatedReasoningLogicStatementList, 0]]
  ], AutomatedReasoningCheckTooComplexFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTooComplexFinding",
    0,
    [],
    []
  ], AutomatedReasoningCheckTranslation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTranslation",
    0,
    ["claims", "confidence", "premises", "untranslatedPremises", "untranslatedClaims"],
    [[() => AutomatedReasoningLogicStatementList, 0], 1, [() => AutomatedReasoningLogicStatementList, 0], [() => AutomatedReasoningCheckInputTextReferenceList, 0], [() => AutomatedReasoningCheckInputTextReferenceList, 0]],
    2
  ], AutomatedReasoningCheckTranslationAmbiguousFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTranslationAmbiguousFinding",
    0,
    ["options", "differenceScenarios"],
    [[() => AutomatedReasoningCheckTranslationOptionList, 0], [() => AutomatedReasoningCheckDifferenceScenarioList, 0]]
  ], AutomatedReasoningCheckTranslationOption$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTranslationOption",
    0,
    ["translations"],
    [[() => AutomatedReasoningCheckTranslationList, 0]]
  ], AutomatedReasoningCheckValidFinding$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckValidFinding",
    0,
    ["translation", "claimsTrueScenario", "supportingRules", "logicWarning"],
    [[() => AutomatedReasoningCheckTranslation$, 0], [() => AutomatedReasoningCheckScenario$, 0], () => AutomatedReasoningCheckRuleList, [() => AutomatedReasoningCheckLogicWarning$, 0]]
  ], AutomatedReasoningLogicStatement$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningLogicStatement",
    0,
    ["logic", "naturalLanguage"],
    [[() => AutomatedReasoningLogicStatementContent, 0], [() => AutomatedReasoningNaturalLanguageStatementContent, 0]],
    1
  ], AutomatedReasoningPolicyAddRuleAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddRuleAnnotation",
    0,
    ["expression"],
    [[() => AutomatedReasoningPolicyDefinitionRuleExpression, 0]],
    1
  ], AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation",
    0,
    ["naturalLanguage"],
    [[() => AutomatedReasoningPolicyAnnotationRuleNaturalLanguage, 0]],
    1
  ], AutomatedReasoningPolicyAddRuleMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddRuleMutation",
    0,
    ["rule"],
    [[() => AutomatedReasoningPolicyDefinitionRule$, 0]],
    1
  ], AutomatedReasoningPolicyAddTypeAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddTypeAnnotation",
    0,
    ["name", "description", "values"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyDefinitionTypeDescription, 0], [() => AutomatedReasoningPolicyDefinitionTypeValueList, 0]],
    3
  ], AutomatedReasoningPolicyAddTypeMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddTypeMutation",
    0,
    ["type"],
    [[() => AutomatedReasoningPolicyDefinitionType$, 0]],
    1
  ], AutomatedReasoningPolicyAddTypeValue$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddTypeValue",
    0,
    ["value", "description"],
    [0, [() => AutomatedReasoningPolicyDefinitionTypeValueDescription, 0]],
    1
  ], AutomatedReasoningPolicyAddVariableAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddVariableAnnotation",
    0,
    ["name", "type", "description"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0], [() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyDefinitionVariableDescription, 0]],
    3
  ], AutomatedReasoningPolicyAddVariableMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAddVariableMutation",
    0,
    ["variable"],
    [[() => AutomatedReasoningPolicyDefinitionVariable$, 0]],
    1
  ], AutomatedReasoningPolicyAnnotatedChunk$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotatedChunk",
    0,
    ["content", "pageNumber"],
    [[() => AutomatedReasoningPolicyAnnotatedContentList, 0], 1],
    1
  ], AutomatedReasoningPolicyAnnotatedLine$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotatedLine",
    0,
    ["lineNumber", "lineText"],
    [1, [() => AutomatedReasoningPolicyLineText, 0]]
  ], AutomatedReasoningPolicyAtomicStatement$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAtomicStatement",
    0,
    ["id", "text", "location"],
    [0, [() => AutomatedReasoningPolicyStatementText, 0], () => AutomatedReasoningPolicyStatementLocation$],
    3
  ], AutomatedReasoningPolicyBuildLog$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildLog",
    0,
    ["entries"],
    [[() => AutomatedReasoningPolicyBuildLogEntryList, 0]],
    1
  ], AutomatedReasoningPolicyBuildLogEntry$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildLogEntry",
    0,
    ["annotation", "status", "buildSteps"],
    [[() => AutomatedReasoningPolicyAnnotation$, 0], 0, [() => AutomatedReasoningPolicyBuildStepList, 0]],
    3
  ], AutomatedReasoningPolicyBuildResultAssetManifest$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildResultAssetManifest",
    0,
    ["entries"],
    [[() => AutomatedReasoningPolicyBuildResultAssetManifestList, 0]],
    1
  ], AutomatedReasoningPolicyBuildResultAssetManifestEntry$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildResultAssetManifestEntry",
    0,
    ["assetType", "assetName", "assetId"],
    [0, [() => AutomatedReasoningPolicyBuildResultAssetName, 0], 0],
    1
  ], AutomatedReasoningPolicyBuildStep$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildStep",
    0,
    ["context", "messages", "priorElement"],
    [[() => AutomatedReasoningPolicyBuildStepContext$, 0], () => AutomatedReasoningPolicyBuildStepMessageList, [() => AutomatedReasoningPolicyDefinitionElement$, 0]],
    2
  ], AutomatedReasoningPolicyBuildStepMessage$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildStepMessage",
    0,
    ["message", "messageType"],
    [0, 0],
    2
  ], AutomatedReasoningPolicyBuildWorkflowDocument$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowDocument",
    0,
    ["document", "documentContentType", "documentName", "documentDescription"],
    [[() => AutomatedReasoningPolicyBuildDocumentBlob, 0], 0, [() => AutomatedReasoningPolicyBuildDocumentName, 0], [() => AutomatedReasoningPolicyBuildDocumentDescription, 0]],
    3
  ], AutomatedReasoningPolicyBuildWorkflowRepairContent$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowRepairContent",
    0,
    ["annotations"],
    [[() => AutomatedReasoningPolicyAnnotationList, 0]],
    1
  ], AutomatedReasoningPolicyBuildWorkflowSource$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowSource",
    0,
    ["policyDefinition", "workflowContent"],
    [[() => AutomatedReasoningPolicyDefinition$, 0], [() => AutomatedReasoningPolicyWorkflowTypeContent$, 0]]
  ], AutomatedReasoningPolicyBuildWorkflowSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowSummary",
    0,
    ["policyArn", "buildWorkflowId", "status", "buildWorkflowType", "createdAt", "updatedAt"],
    [0, 0, 0, 0, 5, 5],
    6
  ], AutomatedReasoningPolicyDefinition$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinition",
    0,
    ["version", "types", "rules", "variables"],
    [0, [() => AutomatedReasoningPolicyDefinitionTypeList, 0], [() => AutomatedReasoningPolicyDefinitionRuleList, 0], [() => AutomatedReasoningPolicyDefinitionVariableList, 0]]
  ], AutomatedReasoningPolicyDefinitionQualityReport$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionQualityReport",
    0,
    ["typeCount", "variableCount", "ruleCount", "unusedTypes", "unusedTypeValues", "unusedVariables", "conflictingRules", "disjointRuleSets"],
    [1, 1, 1, [() => AutomatedReasoningPolicyDefinitionTypeNameList, 0], [() => AutomatedReasoningPolicyDefinitionTypeValuePairList, 0], [() => AutomatedReasoningPolicyDefinitionVariableNameList, 0], 64, [() => AutomatedReasoningPolicyDisjointRuleSetList, 0]],
    8
  ], AutomatedReasoningPolicyDefinitionRule$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionRule",
    0,
    ["id", "expression", "alternateExpression"],
    [0, [() => AutomatedReasoningPolicyDefinitionRuleExpression, 0], [() => AutomatedReasoningPolicyDefinitionRuleAlternateExpression, 0]],
    2
  ], AutomatedReasoningPolicyDefinitionType$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionType",
    0,
    ["name", "values", "description"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyDefinitionTypeValueList, 0], [() => AutomatedReasoningPolicyDefinitionTypeDescription, 0]],
    2
  ], AutomatedReasoningPolicyDefinitionTypeValue$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeValue",
    0,
    ["value", "description"],
    [0, [() => AutomatedReasoningPolicyDefinitionTypeValueDescription, 0]],
    1
  ], AutomatedReasoningPolicyDefinitionTypeValuePair$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeValuePair",
    0,
    ["typeName", "valueName"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0], 0],
    2
  ], AutomatedReasoningPolicyDefinitionVariable$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionVariable",
    0,
    ["name", "type", "description"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0], [() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyDefinitionVariableDescription, 0]],
    3
  ], AutomatedReasoningPolicyDeleteRuleAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteRuleAnnotation",
    0,
    ["ruleId"],
    [0],
    1
  ], AutomatedReasoningPolicyDeleteRuleMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteRuleMutation",
    0,
    ["id"],
    [0],
    1
  ], AutomatedReasoningPolicyDeleteTypeAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteTypeAnnotation",
    0,
    ["name"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0]],
    1
  ], AutomatedReasoningPolicyDeleteTypeMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteTypeMutation",
    0,
    ["name"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0]],
    1
  ], AutomatedReasoningPolicyDeleteTypeValue$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteTypeValue",
    0,
    ["value"],
    [0],
    1
  ], AutomatedReasoningPolicyDeleteVariableAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteVariableAnnotation",
    0,
    ["name"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0]],
    1
  ], AutomatedReasoningPolicyDeleteVariableMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDeleteVariableMutation",
    0,
    ["name"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0]],
    1
  ], AutomatedReasoningPolicyDisjointRuleSet$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDisjointRuleSet",
    0,
    ["variables", "rules"],
    [[() => AutomatedReasoningPolicyDefinitionVariableNameList, 0], 64],
    2
  ], AutomatedReasoningPolicyFidelityReport$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyFidelityReport",
    0,
    ["coverageScore", "accuracyScore", "ruleReports", "variableReports", "documentSources"],
    [1, 1, [() => AutomatedReasoningPolicyRuleReportMap, 0], [() => AutomatedReasoningPolicyVariableReportMap, 0], [() => AutomatedReasoningPolicyReportSourceDocumentList, 0]],
    5
  ], AutomatedReasoningPolicyGeneratedTestCase$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyGeneratedTestCase",
    0,
    ["queryContent", "guardContent", "expectedAggregatedFindingsResult"],
    [[() => AutomatedReasoningPolicyTestQueryContent, 0], [() => AutomatedReasoningPolicyTestGuardContent, 0], 0],
    3
  ], AutomatedReasoningPolicyGeneratedTestCases$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyGeneratedTestCases",
    0,
    ["generatedTestCases"],
    [[() => AutomatedReasoningPolicyGeneratedTestCaseList, 0]],
    1
  ], AutomatedReasoningPolicyIngestContentAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyIngestContentAnnotation",
    0,
    ["content"],
    [[() => AutomatedReasoningPolicyAnnotationIngestContent, 0]],
    1
  ], AutomatedReasoningPolicyPlanning$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyPlanning",
    0,
    [],
    []
  ], AutomatedReasoningPolicyReportSourceDocument$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyReportSourceDocument",
    0,
    ["documentName", "documentHash", "documentId", "atomicStatements", "documentContent"],
    [[() => AutomatedReasoningPolicyBuildDocumentName, 0], 0, 0, [() => AutomatedReasoningPolicyAtomicStatementList, 0], [() => AutomatedReasoningPolicyAnnotatedChunkList, 0]],
    5
  ], AutomatedReasoningPolicyRuleReport$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyRuleReport",
    0,
    ["rule", "groundingStatements", "groundingJustifications", "accuracyScore", "accuracyJustification"],
    [0, () => AutomatedReasoningPolicyStatementReferenceList, [() => AutomatedReasoningPolicyJustificationList, 0], 1, [() => AutomatedReasoningPolicyJustificationText, 0]],
    1
  ], AutomatedReasoningPolicyScenario$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyScenario",
    0,
    ["expression", "alternateExpression", "expectedResult", "ruleIds"],
    [[() => AutomatedReasoningPolicyScenarioExpression, 0], [() => AutomatedReasoningPolicyScenarioAlternateExpression, 0], 0, 64],
    4
  ], AutomatedReasoningPolicyScenarios$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyScenarios",
    0,
    ["policyScenarios"],
    [[() => AutomatedReasoningPolicyScenarioList, 0]],
    1
  ], AutomatedReasoningPolicySourceDocument$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicySourceDocument",
    0,
    ["document", "documentContentType", "documentName", "documentHash", "documentDescription"],
    [[() => AutomatedReasoningPolicyBuildDocumentBlob, 0], 0, [() => AutomatedReasoningPolicyBuildDocumentName, 0], 0, [() => AutomatedReasoningPolicyBuildDocumentDescription, 0]],
    4
  ], AutomatedReasoningPolicyStatementLocation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyStatementLocation",
    0,
    ["lines"],
    [65],
    1
  ], AutomatedReasoningPolicyStatementReference$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyStatementReference",
    0,
    ["documentId", "statementId"],
    [0, 0],
    2
  ], AutomatedReasoningPolicySummary$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicySummary",
    0,
    ["policyArn", "name", "version", "policyId", "createdAt", "updatedAt", "description"],
    [0, [() => AutomatedReasoningPolicyName, 0], 0, 0, 5, 5, [() => AutomatedReasoningPolicyDescription, 0]],
    6
  ], AutomatedReasoningPolicyTestCase$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTestCase",
    0,
    ["testCaseId", "guardContent", "createdAt", "updatedAt", "queryContent", "expectedAggregatedFindingsResult", "confidenceThreshold"],
    [0, [() => AutomatedReasoningPolicyTestGuardContent, 0], 5, 5, [() => AutomatedReasoningPolicyTestQueryContent, 0], 0, 1],
    4
  ], AutomatedReasoningPolicyTestResult$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTestResult",
    0,
    ["testCase", "policyArn", "testRunStatus", "updatedAt", "testFindings", "testRunResult", "aggregatedTestFindingsResult"],
    [[() => AutomatedReasoningPolicyTestCase$, 0], 0, 0, 5, [() => AutomatedReasoningCheckFindingList, 0], 0, 0],
    4
  ], AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation",
    0,
    ["feedback", "ruleIds"],
    [[() => AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage, 0], 64],
    1
  ], AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation",
    0,
    ["scenarioExpression", "ruleIds", "feedback"],
    [[() => AutomatedReasoningPolicyScenarioExpression, 0], 64, [() => AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage, 0]],
    1
  ], AutomatedReasoningPolicyUpdateRuleAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateRuleAnnotation",
    0,
    ["ruleId", "expression"],
    [0, [() => AutomatedReasoningPolicyDefinitionRuleExpression, 0]],
    2
  ], AutomatedReasoningPolicyUpdateRuleMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateRuleMutation",
    0,
    ["rule"],
    [[() => AutomatedReasoningPolicyDefinitionRule$, 0]],
    1
  ], AutomatedReasoningPolicyUpdateTypeAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateTypeAnnotation",
    0,
    ["name", "values", "newName", "description"],
    [[() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyTypeValueAnnotationList, 0], [() => AutomatedReasoningPolicyDefinitionTypeName, 0], [() => AutomatedReasoningPolicyDefinitionTypeDescription, 0]],
    2
  ], AutomatedReasoningPolicyUpdateTypeMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateTypeMutation",
    0,
    ["type"],
    [[() => AutomatedReasoningPolicyDefinitionType$, 0]],
    1
  ], AutomatedReasoningPolicyUpdateTypeValue$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateTypeValue",
    0,
    ["value", "newValue", "description"],
    [0, 0, [() => AutomatedReasoningPolicyDefinitionTypeValueDescription, 0]],
    1
  ], AutomatedReasoningPolicyUpdateVariableAnnotation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateVariableAnnotation",
    0,
    ["name", "newName", "description"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0], [() => AutomatedReasoningPolicyDefinitionVariableName, 0], [() => AutomatedReasoningPolicyDefinitionVariableDescription, 0]],
    1
  ], AutomatedReasoningPolicyUpdateVariableMutation$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyUpdateVariableMutation",
    0,
    ["variable"],
    [[() => AutomatedReasoningPolicyDefinitionVariable$, 0]],
    1
  ], AutomatedReasoningPolicyVariableReport$ = [
    3,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyVariableReport",
    0,
    ["policyVariable", "groundingStatements", "groundingJustifications", "accuracyScore", "accuracyJustification"],
    [[() => AutomatedReasoningPolicyDefinitionVariableName, 0], () => AutomatedReasoningPolicyStatementReferenceList, [() => AutomatedReasoningPolicyJustificationList, 0], 1, [() => AutomatedReasoningPolicyJustificationText, 0]],
    1
  ], BatchDeleteEvaluationJobError$ = [
    3,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobError",
    0,
    ["jobIdentifier", "code", "message"],
    [[() => EvaluationJobIdentifier, 0], 0, 0],
    2
  ], BatchDeleteEvaluationJobItem$ = [
    3,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobItem",
    0,
    ["jobIdentifier", "jobStatus"],
    [[() => EvaluationJobIdentifier, 0], 0],
    2
  ], BatchDeleteEvaluationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobRequest",
    0,
    ["jobIdentifiers"],
    [[() => EvaluationJobIdentifiers, 0]],
    1
  ], BatchDeleteEvaluationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobResponse",
    0,
    ["errors", "evaluationJobs"],
    [[() => BatchDeleteEvaluationJobErrors, 0], [() => BatchDeleteEvaluationJobItems, 0]],
    2
  ], BedrockEvaluatorModel$ = [
    3,
    "com.amazonaws.bedrock",
    "BedrockEvaluatorModel",
    0,
    ["modelIdentifier"],
    [0],
    1
  ], ByteContentDoc$ = [
    3,
    "com.amazonaws.bedrock",
    "ByteContentDoc",
    0,
    ["identifier", "contentType", "data"],
    [[() => Identifier, 0], 0, [() => ByteContentBlob, 0]],
    3
  ], CancelAutomatedReasoningPolicyBuildWorkflowRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CancelAutomatedReasoningPolicyBuildWorkflowRequest",
    0,
    ["policyArn", "buildWorkflowId"],
    [[0, 1], [0, 1]],
    2
  ], CancelAutomatedReasoningPolicyBuildWorkflowResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CancelAutomatedReasoningPolicyBuildWorkflowResponse",
    0,
    [],
    []
  ], CloudWatchConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "CloudWatchConfig",
    0,
    ["logGroupName", "roleArn", "largeDataDeliveryS3Config"],
    [0, 0, () => S3Config$],
    2
  ], CreateAutomatedReasoningPolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyRequest",
    0,
    ["name", "description", "clientRequestToken", "policyDefinition", "kmsKeyId", "tags"],
    [[() => AutomatedReasoningPolicyName, 0], [() => AutomatedReasoningPolicyDescription, 0], [0, 4], [() => AutomatedReasoningPolicyDefinition$, 0], 0, () => TagList],
    1
  ], CreateAutomatedReasoningPolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyResponse",
    0,
    ["policyArn", "version", "name", "createdAt", "updatedAt", "description", "definitionHash"],
    [0, 0, [() => AutomatedReasoningPolicyName, 0], 5, 5, [() => AutomatedReasoningPolicyDescription, 0], 0],
    5
  ], CreateAutomatedReasoningPolicyTestCaseRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyTestCaseRequest",
    0,
    ["policyArn", "guardContent", "expectedAggregatedFindingsResult", "queryContent", "clientRequestToken", "confidenceThreshold"],
    [[0, 1], [() => AutomatedReasoningPolicyTestGuardContent, 0], 0, [() => AutomatedReasoningPolicyTestQueryContent, 0], [0, 4], 1],
    3
  ], CreateAutomatedReasoningPolicyTestCaseResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyTestCaseResponse",
    0,
    ["policyArn", "testCaseId"],
    [0, 0],
    2
  ], CreateAutomatedReasoningPolicyVersionRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyVersionRequest",
    0,
    ["policyArn", "lastUpdatedDefinitionHash", "clientRequestToken", "tags"],
    [[0, 1], 0, [0, 4], () => TagList],
    2
  ], CreateAutomatedReasoningPolicyVersionResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyVersionResponse",
    0,
    ["policyArn", "version", "name", "definitionHash", "createdAt", "description"],
    [0, 0, [() => AutomatedReasoningPolicyName, 0], 0, 5, [() => AutomatedReasoningPolicyDescription, 0]],
    5
  ], CreateCustomModelDeploymentRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateCustomModelDeploymentRequest",
    0,
    ["modelDeploymentName", "modelArn", "description", "tags", "clientRequestToken"],
    [0, 0, 0, () => TagList, [0, 4]],
    2
  ], CreateCustomModelDeploymentResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateCustomModelDeploymentResponse",
    0,
    ["customModelDeploymentArn"],
    [0],
    1
  ], CreateCustomModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateCustomModelRequest",
    0,
    ["modelName", "modelSourceConfig", "modelKmsKeyArn", "roleArn", "modelTags", "clientRequestToken"],
    [0, () => ModelDataSource$, 0, 0, () => TagList, [0, 4]],
    2
  ], CreateCustomModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateCustomModelResponse",
    0,
    ["modelArn"],
    [0],
    1
  ], CreateEvaluationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateEvaluationJobRequest",
    0,
    ["jobName", "roleArn", "evaluationConfig", "inferenceConfig", "outputDataConfig", "jobDescription", "clientRequestToken", "customerEncryptionKeyId", "jobTags", "applicationType"],
    [0, 0, [() => EvaluationConfig$, 0], [() => EvaluationInferenceConfig$, 0], () => EvaluationOutputDataConfig$, [() => EvaluationJobDescription, 0], [0, 4], 0, () => TagList, 0],
    5
  ], CreateEvaluationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateEvaluationJobResponse",
    0,
    ["jobArn"],
    [0],
    1
  ], CreateFoundationModelAgreementRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateFoundationModelAgreementRequest",
    0,
    ["offerToken", "modelId"],
    [0, 0],
    2
  ], CreateFoundationModelAgreementResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateFoundationModelAgreementResponse",
    0,
    ["modelId"],
    [0],
    1
  ], CreateGuardrailRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateGuardrailRequest",
    0,
    ["name", "blockedInputMessaging", "blockedOutputsMessaging", "description", "topicPolicyConfig", "contentPolicyConfig", "wordPolicyConfig", "sensitiveInformationPolicyConfig", "contextualGroundingPolicyConfig", "automatedReasoningPolicyConfig", "crossRegionConfig", "kmsKeyId", "tags", "clientRequestToken"],
    [[() => GuardrailName, 0], [() => GuardrailBlockedMessaging, 0], [() => GuardrailBlockedMessaging, 0], [() => GuardrailDescription, 0], [() => GuardrailTopicPolicyConfig$, 0], [() => GuardrailContentPolicyConfig$, 0], [() => GuardrailWordPolicyConfig$, 0], () => GuardrailSensitiveInformationPolicyConfig$, [() => GuardrailContextualGroundingPolicyConfig$, 0], () => GuardrailAutomatedReasoningPolicyConfig$, () => GuardrailCrossRegionConfig$, 0, () => TagList, [0, 4]],
    3
  ], CreateGuardrailResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateGuardrailResponse",
    0,
    ["guardrailId", "guardrailArn", "version", "createdAt"],
    [0, 0, 0, 5],
    4
  ], CreateGuardrailVersionRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateGuardrailVersionRequest",
    0,
    ["guardrailIdentifier", "description", "clientRequestToken"],
    [[0, 1], [() => GuardrailDescription, 0], [0, 4]],
    1
  ], CreateGuardrailVersionResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateGuardrailVersionResponse",
    0,
    ["guardrailId", "version"],
    [0, 0],
    2
  ], CreateInferenceProfileRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateInferenceProfileRequest",
    0,
    ["inferenceProfileName", "modelSource", "description", "clientRequestToken", "tags"],
    [0, () => InferenceProfileModelSource$, [() => InferenceProfileDescription, 0], [0, 4], () => TagList],
    2
  ], CreateInferenceProfileResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateInferenceProfileResponse",
    0,
    ["inferenceProfileArn", "status"],
    [0, 0],
    1
  ], CreateMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateMarketplaceModelEndpointRequest",
    0,
    ["modelSourceIdentifier", "endpointConfig", "endpointName", "acceptEula", "clientRequestToken", "tags"],
    [0, () => EndpointConfig$, 0, 2, [0, 4], () => TagList],
    3
  ], CreateMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateMarketplaceModelEndpointResponse",
    0,
    ["marketplaceModelEndpoint"],
    [() => MarketplaceModelEndpoint$],
    1
  ], CreateModelCopyJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelCopyJobRequest",
    0,
    ["sourceModelArn", "targetModelName", "modelKmsKeyId", "targetModelTags", "clientRequestToken"],
    [0, 0, 0, () => TagList, [0, 4]],
    2
  ], CreateModelCopyJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelCopyJobResponse",
    0,
    ["jobArn"],
    [0],
    1
  ], CreateModelCustomizationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelCustomizationJobRequest",
    0,
    ["jobName", "customModelName", "roleArn", "baseModelIdentifier", "trainingDataConfig", "outputDataConfig", "clientRequestToken", "customizationType", "customModelKmsKeyId", "jobTags", "customModelTags", "validationDataConfig", "hyperParameters", "vpcConfig", "customizationConfig"],
    [0, 0, 0, 0, [() => TrainingDataConfig$, 0], () => OutputDataConfig$, [0, 4], 0, 0, () => TagList, () => TagList, () => ValidationDataConfig$, 128, () => VpcConfig$, () => CustomizationConfig$],
    6
  ], CreateModelCustomizationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelCustomizationJobResponse",
    0,
    ["jobArn"],
    [0],
    1
  ], CreateModelImportJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelImportJobRequest",
    0,
    ["jobName", "importedModelName", "roleArn", "modelDataSource", "jobTags", "importedModelTags", "clientRequestToken", "vpcConfig", "importedModelKmsKeyId"],
    [0, 0, 0, () => ModelDataSource$, () => TagList, () => TagList, 0, () => VpcConfig$, 0],
    4
  ], CreateModelImportJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelImportJobResponse",
    0,
    ["jobArn"],
    [0],
    1
  ], CreateModelInvocationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelInvocationJobRequest",
    0,
    ["jobName", "roleArn", "modelId", "inputDataConfig", "outputDataConfig", "clientRequestToken", "vpcConfig", "timeoutDurationInHours", "tags", "modelInvocationType"],
    [0, 0, 0, () => ModelInvocationJobInputDataConfig$, () => ModelInvocationJobOutputDataConfig$, [0, 4], () => VpcConfig$, 1, () => TagList, 0],
    5
  ], CreateModelInvocationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateModelInvocationJobResponse",
    0,
    ["jobArn"],
    [0],
    1
  ], CreatePromptRouterRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreatePromptRouterRequest",
    0,
    ["promptRouterName", "models", "routingCriteria", "fallbackModel", "clientRequestToken", "description", "tags"],
    [0, () => PromptRouterTargetModels, () => RoutingCriteria$, () => PromptRouterTargetModel$, [0, 4], [() => PromptRouterDescription, 0], () => TagList],
    4
  ], CreatePromptRouterResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreatePromptRouterResponse",
    0,
    ["promptRouterArn"],
    [0]
  ], CreateProvisionedModelThroughputRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateProvisionedModelThroughputRequest",
    0,
    ["modelUnits", "provisionedModelName", "modelId", "clientRequestToken", "commitmentDuration", "tags"],
    [1, 0, 0, [0, 4], 0, () => TagList],
    3
  ], CreateProvisionedModelThroughputResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "CreateProvisionedModelThroughputResponse",
    0,
    ["provisionedModelArn"],
    [0],
    1
  ], CustomMetricBedrockEvaluatorModel$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomMetricBedrockEvaluatorModel",
    0,
    ["modelIdentifier"],
    [0],
    1
  ], CustomMetricDefinition$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomMetricDefinition",
    8,
    ["name", "instructions", "ratingScale"],
    [[() => MetricName, 0], 0, () => RatingScale],
    2
  ], CustomMetricEvaluatorModelConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomMetricEvaluatorModelConfig",
    0,
    ["bedrockEvaluatorModels"],
    [() => CustomMetricBedrockEvaluatorModels],
    1
  ], CustomModelDeploymentSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomModelDeploymentSummary",
    0,
    ["customModelDeploymentArn", "customModelDeploymentName", "modelArn", "createdAt", "status", "lastUpdatedAt", "failureMessage"],
    [0, 0, 0, 5, 0, 5, 0],
    5
  ], CustomModelDeploymentUpdateDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomModelDeploymentUpdateDetails",
    0,
    ["modelArn", "updateStatus"],
    [0, 0],
    2
  ], CustomModelSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomModelSummary",
    0,
    ["modelArn", "modelName", "creationTime", "baseModelArn", "baseModelName", "customizationType", "ownerAccountId", "modelStatus"],
    [0, 0, 5, 0, 0, 0, 0, 0],
    5
  ], CustomModelUnits$ = [
    3,
    "com.amazonaws.bedrock",
    "CustomModelUnits",
    0,
    ["customModelUnitsPerModelCopy", "customModelUnitsVersion"],
    [1, 0]
  ], DataProcessingDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "DataProcessingDetails",
    0,
    ["status", "creationTime", "lastModifiedTime"],
    [0, 5, 5]
  ], DeleteAutomatedReasoningPolicyBuildWorkflowRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyBuildWorkflowRequest",
    0,
    ["policyArn", "buildWorkflowId", "lastUpdatedAt"],
    [[0, 1], [0, 1], [5, { ["httpQuery"]: "updatedAt" }]],
    3
  ], DeleteAutomatedReasoningPolicyBuildWorkflowResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyBuildWorkflowResponse",
    0,
    [],
    []
  ], DeleteAutomatedReasoningPolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyRequest",
    0,
    ["policyArn", "force"],
    [[0, 1], [2, { ["httpQuery"]: "force" }]],
    1
  ], DeleteAutomatedReasoningPolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyResponse",
    0,
    [],
    []
  ], DeleteAutomatedReasoningPolicyTestCaseRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyTestCaseRequest",
    0,
    ["policyArn", "testCaseId", "lastUpdatedAt"],
    [[0, 1], [0, 1], [5, { ["httpQuery"]: "updatedAt" }]],
    3
  ], DeleteAutomatedReasoningPolicyTestCaseResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyTestCaseResponse",
    0,
    [],
    []
  ], DeleteCustomModelDeploymentRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteCustomModelDeploymentRequest",
    0,
    ["customModelDeploymentIdentifier"],
    [[0, 1]],
    1
  ], DeleteCustomModelDeploymentResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteCustomModelDeploymentResponse",
    0,
    [],
    []
  ], DeleteCustomModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteCustomModelRequest",
    0,
    ["modelIdentifier"],
    [[0, 1]],
    1
  ], DeleteCustomModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteCustomModelResponse",
    0,
    [],
    []
  ], DeleteEnforcedGuardrailConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteEnforcedGuardrailConfigurationRequest",
    0,
    ["configId"],
    [[0, 1]],
    1
  ], DeleteEnforcedGuardrailConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteEnforcedGuardrailConfigurationResponse",
    0,
    [],
    []
  ], DeleteFoundationModelAgreementRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteFoundationModelAgreementRequest",
    0,
    ["modelId"],
    [0],
    1
  ], DeleteFoundationModelAgreementResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteFoundationModelAgreementResponse",
    0,
    [],
    []
  ], DeleteGuardrailRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteGuardrailRequest",
    0,
    ["guardrailIdentifier", "guardrailVersion"],
    [[0, 1], [0, { ["httpQuery"]: "guardrailVersion" }]],
    1
  ], DeleteGuardrailResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteGuardrailResponse",
    0,
    [],
    []
  ], DeleteImportedModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteImportedModelRequest",
    0,
    ["modelIdentifier"],
    [[0, 1]],
    1
  ], DeleteImportedModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteImportedModelResponse",
    0,
    [],
    []
  ], DeleteInferenceProfileRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteInferenceProfileRequest",
    0,
    ["inferenceProfileIdentifier"],
    [[0, 1]],
    1
  ], DeleteInferenceProfileResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteInferenceProfileResponse",
    0,
    [],
    []
  ], DeleteMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteMarketplaceModelEndpointRequest",
    0,
    ["endpointArn"],
    [[0, 1]],
    1
  ], DeleteMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteMarketplaceModelEndpointResponse",
    0,
    [],
    []
  ], DeleteModelInvocationLoggingConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteModelInvocationLoggingConfigurationRequest",
    0,
    [],
    []
  ], DeleteModelInvocationLoggingConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteModelInvocationLoggingConfigurationResponse",
    0,
    [],
    []
  ], DeletePromptRouterRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeletePromptRouterRequest",
    0,
    ["promptRouterArn"],
    [[0, 1]],
    1
  ], DeletePromptRouterResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeletePromptRouterResponse",
    0,
    [],
    []
  ], DeleteProvisionedModelThroughputRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteProvisionedModelThroughputRequest",
    0,
    ["provisionedModelId"],
    [[0, 1]],
    1
  ], DeleteProvisionedModelThroughputResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteProvisionedModelThroughputResponse",
    0,
    [],
    []
  ], DeleteResourcePolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteResourcePolicyRequest",
    0,
    ["resourceArn"],
    [[0, 1]],
    1
  ], DeleteResourcePolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeleteResourcePolicyResponse",
    0,
    [],
    []
  ], DeregisterMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "DeregisterMarketplaceModelEndpointRequest",
    0,
    ["endpointArn"],
    [[0, 1]],
    1
  ], DeregisterMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "DeregisterMarketplaceModelEndpointResponse",
    0,
    [],
    []
  ], DimensionalPriceRate$ = [
    3,
    "com.amazonaws.bedrock",
    "DimensionalPriceRate",
    0,
    ["dimension", "price", "description", "unit"],
    [0, 0, 0, 0]
  ], DistillationConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "DistillationConfig",
    0,
    ["teacherModelConfig"],
    [() => TeacherModelConfig$],
    1
  ], EvaluationBedrockModel$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationBedrockModel",
    0,
    ["modelIdentifier", "inferenceParams", "performanceConfig"],
    [0, [() => EvaluationModelInferenceParams, 0], () => PerformanceConfiguration$],
    1
  ], EvaluationDataset$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationDataset",
    0,
    ["name", "datasetLocation"],
    [[() => EvaluationDatasetName, 0], () => EvaluationDatasetLocation$],
    1
  ], EvaluationDatasetMetricConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationDatasetMetricConfig",
    0,
    ["taskType", "dataset", "metricNames"],
    [0, [() => EvaluationDataset$, 0], [() => EvaluationMetricNames, 0]],
    3
  ], EvaluationInferenceConfigSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationInferenceConfigSummary",
    0,
    ["modelConfigSummary", "ragConfigSummary"],
    [() => EvaluationModelConfigSummary$, () => EvaluationRagConfigSummary$]
  ], EvaluationModelConfigSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationModelConfigSummary",
    0,
    ["bedrockModelIdentifiers", "precomputedInferenceSourceIdentifiers"],
    [64, 64]
  ], EvaluationOutputDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationOutputDataConfig",
    0,
    ["s3Uri"],
    [0],
    1
  ], EvaluationPrecomputedInferenceSource$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationPrecomputedInferenceSource",
    0,
    ["inferenceSourceIdentifier"],
    [0],
    1
  ], EvaluationPrecomputedRetrieveAndGenerateSourceConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationPrecomputedRetrieveAndGenerateSourceConfig",
    0,
    ["ragSourceIdentifier"],
    [0],
    1
  ], EvaluationPrecomputedRetrieveSourceConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationPrecomputedRetrieveSourceConfig",
    0,
    ["ragSourceIdentifier"],
    [0],
    1
  ], EvaluationRagConfigSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationRagConfigSummary",
    0,
    ["bedrockKnowledgeBaseIdentifiers", "precomputedRagSourceIdentifiers"],
    [64, 64]
  ], EvaluationSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "EvaluationSummary",
    0,
    ["jobArn", "jobName", "status", "creationTime", "jobType", "evaluationTaskTypes", "modelIdentifiers", "ragIdentifiers", "evaluatorModelIdentifiers", "customMetricsEvaluatorModelIdentifiers", "inferenceConfigSummary", "applicationType"],
    [0, 0, 0, 5, 0, 64, 64, 64, 64, 64, () => EvaluationInferenceConfigSummary$, 0],
    6
  ], ExportAutomatedReasoningPolicyVersionRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ExportAutomatedReasoningPolicyVersionRequest",
    0,
    ["policyArn"],
    [[0, 1]],
    1
  ], ExportAutomatedReasoningPolicyVersionResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ExportAutomatedReasoningPolicyVersionResponse",
    0,
    ["policyDefinition"],
    [[() => AutomatedReasoningPolicyDefinition$, 16]],
    1
  ], ExternalSource$ = [
    3,
    "com.amazonaws.bedrock",
    "ExternalSource",
    0,
    ["sourceType", "s3Location", "byteContent"],
    [0, () => S3ObjectDoc$, [() => ByteContentDoc$, 0]],
    1
  ], ExternalSourcesGenerationConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "ExternalSourcesGenerationConfiguration",
    0,
    ["promptTemplate", "guardrailConfiguration", "kbInferenceConfig", "additionalModelRequestFields"],
    [[() => PromptTemplate$, 0], () => GuardrailConfiguration$, () => KbInferenceConfig$, 143]
  ], ExternalSourcesRetrieveAndGenerateConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "ExternalSourcesRetrieveAndGenerateConfiguration",
    0,
    ["modelArn", "sources", "generationConfiguration"],
    [0, [() => ExternalSources, 0], [() => ExternalSourcesGenerationConfiguration$, 0]],
    2
  ], FieldForReranking$ = [
    3,
    "com.amazonaws.bedrock",
    "FieldForReranking",
    0,
    ["fieldName"],
    [0],
    1
  ], FilterAttribute$ = [
    3,
    "com.amazonaws.bedrock",
    "FilterAttribute",
    0,
    ["key", "value"],
    [0, 15],
    2
  ], FoundationModelDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "FoundationModelDetails",
    0,
    ["modelArn", "modelId", "modelName", "providerName", "inputModalities", "outputModalities", "responseStreamingSupported", "customizationsSupported", "inferenceTypesSupported", "modelLifecycle"],
    [0, 0, 0, 0, 64, 64, 2, 64, 64, () => FoundationModelLifecycle$],
    2
  ], FoundationModelLifecycle$ = [
    3,
    "com.amazonaws.bedrock",
    "FoundationModelLifecycle",
    0,
    ["status", "startOfLifeTime", "endOfLifeTime", "legacyTime", "publicExtendedAccessTime"],
    [0, 5, 5, 5, 5],
    1
  ], FoundationModelSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "FoundationModelSummary",
    0,
    ["modelArn", "modelId", "modelName", "providerName", "inputModalities", "outputModalities", "responseStreamingSupported", "customizationsSupported", "inferenceTypesSupported", "modelLifecycle"],
    [0, 0, 0, 0, 64, 64, 2, 64, 64, () => FoundationModelLifecycle$],
    2
  ], GenerationConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "GenerationConfiguration",
    0,
    ["promptTemplate", "guardrailConfiguration", "kbInferenceConfig", "additionalModelRequestFields"],
    [[() => PromptTemplate$, 0], () => GuardrailConfiguration$, () => KbInferenceConfig$, 143]
  ], GetAutomatedReasoningPolicyAnnotationsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyAnnotationsRequest",
    0,
    ["policyArn", "buildWorkflowId"],
    [[0, 1], [0, 1]],
    2
  ], GetAutomatedReasoningPolicyAnnotationsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyAnnotationsResponse",
    0,
    ["policyArn", "name", "buildWorkflowId", "annotations", "annotationSetHash", "updatedAt"],
    [0, [() => AutomatedReasoningPolicyName, 0], 0, [() => AutomatedReasoningPolicyAnnotationList, 0], 0, 5],
    6
  ], GetAutomatedReasoningPolicyBuildWorkflowRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflowRequest",
    0,
    ["policyArn", "buildWorkflowId"],
    [[0, 1], [0, 1]],
    2
  ], GetAutomatedReasoningPolicyBuildWorkflowResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflowResponse",
    0,
    ["policyArn", "buildWorkflowId", "status", "buildWorkflowType", "createdAt", "updatedAt", "documentName", "documentContentType", "documentDescription"],
    [0, 0, 0, 0, 5, 5, [() => AutomatedReasoningPolicyBuildDocumentName, 0], 0, [() => AutomatedReasoningPolicyBuildDocumentDescription, 0]],
    6
  ], GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest",
    0,
    ["policyArn", "buildWorkflowId", "assetType", "assetId"],
    [[0, 1], [0, 1], [0, { ["httpQuery"]: "assetType" }], [0, { ["httpQuery"]: "assetId" }]],
    3
  ], GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse",
    0,
    ["policyArn", "buildWorkflowId", "buildWorkflowAssets"],
    [0, 0, [() => AutomatedReasoningPolicyBuildResultAssets$, 0]],
    2
  ], GetAutomatedReasoningPolicyNextScenarioRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyNextScenarioRequest",
    0,
    ["policyArn", "buildWorkflowId"],
    [[0, 1], [0, 1]],
    2
  ], GetAutomatedReasoningPolicyNextScenarioResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyNextScenarioResponse",
    0,
    ["policyArn", "scenario"],
    [0, [() => AutomatedReasoningPolicyScenario$, 0]],
    1
  ], GetAutomatedReasoningPolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyRequest",
    0,
    ["policyArn"],
    [[0, 1]],
    1
  ], GetAutomatedReasoningPolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyResponse",
    0,
    ["policyArn", "name", "version", "policyId", "definitionHash", "updatedAt", "description", "kmsKeyArn", "createdAt"],
    [0, [() => AutomatedReasoningPolicyName, 0], 0, 0, 0, 5, [() => AutomatedReasoningPolicyDescription, 0], 0, 5],
    6
  ], GetAutomatedReasoningPolicyTestCaseRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestCaseRequest",
    0,
    ["policyArn", "testCaseId"],
    [[0, 1], [0, 1]],
    2
  ], GetAutomatedReasoningPolicyTestCaseResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestCaseResponse",
    0,
    ["policyArn", "testCase"],
    [0, [() => AutomatedReasoningPolicyTestCase$, 0]],
    2
  ], GetAutomatedReasoningPolicyTestResultRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestResultRequest",
    0,
    ["policyArn", "buildWorkflowId", "testCaseId"],
    [[0, 1], [0, 1], [0, 1]],
    3
  ], GetAutomatedReasoningPolicyTestResultResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestResultResponse",
    0,
    ["testResult"],
    [[() => AutomatedReasoningPolicyTestResult$, 0]],
    1
  ], GetCustomModelDeploymentRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetCustomModelDeploymentRequest",
    0,
    ["customModelDeploymentIdentifier"],
    [[0, 1]],
    1
  ], GetCustomModelDeploymentResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetCustomModelDeploymentResponse",
    0,
    ["customModelDeploymentArn", "modelDeploymentName", "modelArn", "createdAt", "status", "description", "updateDetails", "failureMessage", "lastUpdatedAt"],
    [0, 0, 0, 5, 0, 0, () => CustomModelDeploymentUpdateDetails$, 0, 5],
    5
  ], GetCustomModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetCustomModelRequest",
    0,
    ["modelIdentifier"],
    [[0, 1]],
    1
  ], GetCustomModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetCustomModelResponse",
    0,
    ["modelArn", "modelName", "creationTime", "jobName", "jobArn", "baseModelArn", "customizationType", "modelKmsKeyArn", "hyperParameters", "trainingDataConfig", "validationDataConfig", "outputDataConfig", "trainingMetrics", "validationMetrics", "customizationConfig", "modelStatus", "failureMessage"],
    [0, 0, 5, 0, 0, 0, 0, 0, 128, [() => TrainingDataConfig$, 0], () => ValidationDataConfig$, () => OutputDataConfig$, () => TrainingMetrics$, () => ValidationMetrics, () => CustomizationConfig$, 0, 0],
    3
  ], GetEvaluationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetEvaluationJobRequest",
    0,
    ["jobIdentifier"],
    [[() => EvaluationJobIdentifier, 1]],
    1
  ], GetEvaluationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetEvaluationJobResponse",
    0,
    ["jobName", "status", "jobArn", "roleArn", "jobType", "evaluationConfig", "inferenceConfig", "outputDataConfig", "creationTime", "jobDescription", "customerEncryptionKeyId", "applicationType", "lastModifiedTime", "failureMessages"],
    [0, 0, 0, 0, 0, [() => EvaluationConfig$, 0], [() => EvaluationInferenceConfig$, 0], () => EvaluationOutputDataConfig$, 5, [() => EvaluationJobDescription, 0], 0, 0, 5, 64],
    9
  ], GetFoundationModelAvailabilityRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetFoundationModelAvailabilityRequest",
    0,
    ["modelId"],
    [[0, 1]],
    1
  ], GetFoundationModelAvailabilityResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetFoundationModelAvailabilityResponse",
    0,
    ["modelId", "agreementAvailability", "authorizationStatus", "entitlementAvailability", "regionAvailability"],
    [0, () => AgreementAvailability$, 0, 0, 0],
    5
  ], GetFoundationModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetFoundationModelRequest",
    0,
    ["modelIdentifier"],
    [[0, 1]],
    1
  ], GetFoundationModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetFoundationModelResponse",
    0,
    ["modelDetails"],
    [() => FoundationModelDetails$]
  ], GetGuardrailRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetGuardrailRequest",
    0,
    ["guardrailIdentifier", "guardrailVersion"],
    [[0, 1], [0, { ["httpQuery"]: "guardrailVersion" }]],
    1
  ], GetGuardrailResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetGuardrailResponse",
    0,
    ["name", "guardrailId", "guardrailArn", "version", "status", "createdAt", "updatedAt", "blockedInputMessaging", "blockedOutputsMessaging", "description", "topicPolicy", "contentPolicy", "wordPolicy", "sensitiveInformationPolicy", "contextualGroundingPolicy", "automatedReasoningPolicy", "crossRegionDetails", "statusReasons", "failureRecommendations", "kmsKeyArn"],
    [[() => GuardrailName, 0], 0, 0, 0, 0, 5, 5, [() => GuardrailBlockedMessaging, 0], [() => GuardrailBlockedMessaging, 0], [() => GuardrailDescription, 0], [() => GuardrailTopicPolicy$, 0], [() => GuardrailContentPolicy$, 0], [() => GuardrailWordPolicy$, 0], () => GuardrailSensitiveInformationPolicy$, [() => GuardrailContextualGroundingPolicy$, 0], () => GuardrailAutomatedReasoningPolicy$, () => GuardrailCrossRegionDetails$, [() => GuardrailStatusReasons, 0], [() => GuardrailFailureRecommendations, 0], 0],
    9
  ], GetImportedModelRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetImportedModelRequest",
    0,
    ["modelIdentifier"],
    [[0, 1]],
    1
  ], GetImportedModelResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetImportedModelResponse",
    0,
    ["modelArn", "modelName", "jobName", "jobArn", "modelDataSource", "creationTime", "modelArchitecture", "modelKmsKeyArn", "instructSupported", "customModelUnits"],
    [0, 0, 0, 0, () => ModelDataSource$, 5, 0, 0, 2, () => CustomModelUnits$]
  ], GetInferenceProfileRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetInferenceProfileRequest",
    0,
    ["inferenceProfileIdentifier"],
    [[0, 1]],
    1
  ], GetInferenceProfileResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetInferenceProfileResponse",
    0,
    ["inferenceProfileName", "inferenceProfileArn", "models", "inferenceProfileId", "status", "type", "description", "createdAt", "updatedAt"],
    [0, 0, () => InferenceProfileModels, 0, 0, 0, [() => InferenceProfileDescription, 0], 5, 5],
    6
  ], GetMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetMarketplaceModelEndpointRequest",
    0,
    ["endpointArn"],
    [[0, 1]],
    1
  ], GetMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetMarketplaceModelEndpointResponse",
    0,
    ["marketplaceModelEndpoint"],
    [() => MarketplaceModelEndpoint$]
  ], GetModelCopyJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelCopyJobRequest",
    0,
    ["jobArn"],
    [[0, 1]],
    1
  ], GetModelCopyJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelCopyJobResponse",
    0,
    ["jobArn", "status", "creationTime", "targetModelArn", "sourceAccountId", "sourceModelArn", "targetModelName", "targetModelKmsKeyArn", "targetModelTags", "failureMessage", "sourceModelName"],
    [0, 0, 5, 0, 0, 0, 0, 0, () => TagList, 0, 0],
    6
  ], GetModelCustomizationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelCustomizationJobRequest",
    0,
    ["jobIdentifier"],
    [[0, 1]],
    1
  ], GetModelCustomizationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelCustomizationJobResponse",
    0,
    ["jobArn", "jobName", "outputModelName", "roleArn", "creationTime", "baseModelArn", "trainingDataConfig", "validationDataConfig", "outputDataConfig", "outputModelArn", "clientRequestToken", "status", "statusDetails", "failureMessage", "lastModifiedTime", "endTime", "hyperParameters", "customizationType", "outputModelKmsKeyArn", "trainingMetrics", "validationMetrics", "vpcConfig", "customizationConfig"],
    [0, 0, 0, 0, 5, 0, [() => TrainingDataConfig$, 0], () => ValidationDataConfig$, () => OutputDataConfig$, 0, 0, 0, () => StatusDetails$, 0, 5, 5, 128, 0, 0, () => TrainingMetrics$, () => ValidationMetrics, () => VpcConfig$, () => CustomizationConfig$],
    9
  ], GetModelImportJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelImportJobRequest",
    0,
    ["jobIdentifier"],
    [[0, 1]],
    1
  ], GetModelImportJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelImportJobResponse",
    0,
    ["jobArn", "jobName", "importedModelName", "importedModelArn", "roleArn", "modelDataSource", "status", "failureMessage", "creationTime", "lastModifiedTime", "endTime", "vpcConfig", "importedModelKmsKeyArn"],
    [0, 0, 0, 0, 0, () => ModelDataSource$, 0, 0, 5, 5, 5, () => VpcConfig$, 0]
  ], GetModelInvocationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelInvocationJobRequest",
    0,
    ["jobIdentifier"],
    [[0, 1]],
    1
  ], GetModelInvocationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelInvocationJobResponse",
    0,
    ["jobArn", "modelId", "roleArn", "submitTime", "inputDataConfig", "outputDataConfig", "jobName", "clientRequestToken", "status", "message", "lastModifiedTime", "endTime", "vpcConfig", "timeoutDurationInHours", "jobExpirationTime", "modelInvocationType", "totalRecordCount", "processedRecordCount", "successRecordCount", "errorRecordCount"],
    [0, 0, 0, 5, () => ModelInvocationJobInputDataConfig$, () => ModelInvocationJobOutputDataConfig$, 0, 0, 0, [() => Message, 0], 5, 5, () => VpcConfig$, 1, 5, 0, 1, 1, 1, 1],
    6
  ], GetModelInvocationLoggingConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelInvocationLoggingConfigurationRequest",
    0,
    [],
    []
  ], GetModelInvocationLoggingConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetModelInvocationLoggingConfigurationResponse",
    0,
    ["loggingConfig"],
    [() => LoggingConfig$]
  ], GetPromptRouterRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetPromptRouterRequest",
    0,
    ["promptRouterArn"],
    [[0, 1]],
    1
  ], GetPromptRouterResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetPromptRouterResponse",
    0,
    ["promptRouterName", "routingCriteria", "promptRouterArn", "models", "fallbackModel", "status", "type", "description", "createdAt", "updatedAt"],
    [0, () => RoutingCriteria$, 0, () => PromptRouterTargetModels, () => PromptRouterTargetModel$, 0, 0, [() => PromptRouterDescription, 0], 5, 5],
    7
  ], GetProvisionedModelThroughputRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetProvisionedModelThroughputRequest",
    0,
    ["provisionedModelId"],
    [[0, 1]],
    1
  ], GetProvisionedModelThroughputResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetProvisionedModelThroughputResponse",
    0,
    ["modelUnits", "desiredModelUnits", "provisionedModelName", "provisionedModelArn", "modelArn", "desiredModelArn", "foundationModelArn", "status", "creationTime", "lastModifiedTime", "failureMessage", "commitmentDuration", "commitmentExpirationTime"],
    [1, 1, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5],
    10
  ], GetResourcePolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetResourcePolicyRequest",
    0,
    ["resourceArn"],
    [[0, 1]],
    1
  ], GetResourcePolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetResourcePolicyResponse",
    0,
    ["resourcePolicy"],
    [0]
  ], GetUseCaseForModelAccessRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "GetUseCaseForModelAccessRequest",
    0,
    [],
    []
  ], GetUseCaseForModelAccessResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "GetUseCaseForModelAccessResponse",
    0,
    ["formData"],
    [21],
    1
  ], GuardrailAutomatedReasoningPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailAutomatedReasoningPolicy",
    0,
    ["policies", "confidenceThreshold"],
    [64, 1],
    1
  ], GuardrailAutomatedReasoningPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailAutomatedReasoningPolicyConfig",
    0,
    ["policies", "confidenceThreshold"],
    [64, 1],
    1
  ], GuardrailConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailConfiguration",
    0,
    ["guardrailId", "guardrailVersion"],
    [0, 0],
    2
  ], GuardrailContentFilter$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentFilter",
    0,
    ["type", "inputStrength", "outputStrength", "inputModalities", "outputModalities", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, [() => GuardrailModalities, 0], [() => GuardrailModalities, 0], [() => GuardrailContentFilterAction, 0], [() => GuardrailContentFilterAction, 0], 2, 2],
    3
  ], GuardrailContentFilterConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentFilterConfig",
    0,
    ["type", "inputStrength", "outputStrength", "inputModalities", "outputModalities", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, [() => GuardrailModalities, 0], [() => GuardrailModalities, 0], [() => GuardrailContentFilterAction, 0], [() => GuardrailContentFilterAction, 0], 2, 2],
    3
  ], GuardrailContentFiltersTier$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentFiltersTier",
    0,
    ["tierName"],
    [[() => GuardrailContentFiltersTierName, 0]],
    1
  ], GuardrailContentFiltersTierConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentFiltersTierConfig",
    0,
    ["tierName"],
    [[() => GuardrailContentFiltersTierName, 0]],
    1
  ], GuardrailContentPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentPolicy",
    0,
    ["filters", "tier"],
    [[() => GuardrailContentFilters, 0], [() => GuardrailContentFiltersTier$, 0]]
  ], GuardrailContentPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContentPolicyConfig",
    0,
    ["filtersConfig", "tierConfig"],
    [[() => GuardrailContentFiltersConfig, 0], [() => GuardrailContentFiltersTierConfig$, 0]],
    1
  ], GuardrailContextualGroundingFilter$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingFilter",
    0,
    ["type", "threshold", "action", "enabled"],
    [0, 1, [() => GuardrailContextualGroundingAction, 0], 2],
    2
  ], GuardrailContextualGroundingFilterConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingFilterConfig",
    0,
    ["type", "threshold", "action", "enabled"],
    [0, 1, [() => GuardrailContextualGroundingAction, 0], 2],
    2
  ], GuardrailContextualGroundingPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingPolicy",
    0,
    ["filters"],
    [[() => GuardrailContextualGroundingFilters, 0]],
    1
  ], GuardrailContextualGroundingPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingPolicyConfig",
    0,
    ["filtersConfig"],
    [[() => GuardrailContextualGroundingFiltersConfig, 0]],
    1
  ], GuardrailCrossRegionConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailCrossRegionConfig",
    0,
    ["guardrailProfileIdentifier"],
    [0],
    1
  ], GuardrailCrossRegionDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailCrossRegionDetails",
    0,
    ["guardrailProfileId", "guardrailProfileArn"],
    [0, 0]
  ], GuardrailManagedWords$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailManagedWords",
    0,
    ["type", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, [() => GuardrailWordAction, 0], [() => GuardrailWordAction, 0], 2, 2],
    1
  ], GuardrailManagedWordsConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailManagedWordsConfig",
    0,
    ["type", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, [() => GuardrailWordAction, 0], [() => GuardrailWordAction, 0], 2, 2],
    1
  ], GuardrailPiiEntity$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailPiiEntity",
    0,
    ["type", "action", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, 0, 2, 2],
    2
  ], GuardrailPiiEntityConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailPiiEntityConfig",
    0,
    ["type", "action", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, 0, 2, 2],
    2
  ], GuardrailRegex$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailRegex",
    0,
    ["name", "pattern", "action", "description", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, 0, 0, 0, 2, 2],
    3
  ], GuardrailRegexConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailRegexConfig",
    0,
    ["name", "pattern", "action", "description", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, 0, 0, 0, 0, 0, 2, 2],
    3
  ], GuardrailSensitiveInformationPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailSensitiveInformationPolicy",
    0,
    ["piiEntities", "regexes"],
    [() => GuardrailPiiEntities, () => GuardrailRegexes]
  ], GuardrailSensitiveInformationPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailSensitiveInformationPolicyConfig",
    0,
    ["piiEntitiesConfig", "regexesConfig"],
    [() => GuardrailPiiEntitiesConfig, () => GuardrailRegexesConfig]
  ], GuardrailSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailSummary",
    0,
    ["id", "arn", "status", "name", "version", "createdAt", "updatedAt", "description", "crossRegionDetails"],
    [0, 0, 0, [() => GuardrailName, 0], 0, 5, 5, [() => GuardrailDescription, 0], () => GuardrailCrossRegionDetails$],
    7
  ], GuardrailTopic$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopic",
    0,
    ["name", "definition", "examples", "type", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [[() => GuardrailTopicName, 0], [() => GuardrailTopicDefinition, 0], [() => GuardrailTopicExamples, 0], 0, [() => GuardrailTopicAction, 0], [() => GuardrailTopicAction, 0], 2, 2],
    2
  ], GuardrailTopicConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopicConfig",
    0,
    ["name", "definition", "type", "examples", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [[() => GuardrailTopicName, 0], [() => GuardrailTopicDefinition, 0], 0, [() => GuardrailTopicExamples, 0], [() => GuardrailTopicAction, 0], [() => GuardrailTopicAction, 0], 2, 2],
    3
  ], GuardrailTopicPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopicPolicy",
    0,
    ["topics", "tier"],
    [[() => GuardrailTopics, 0], [() => GuardrailTopicsTier$, 0]],
    1
  ], GuardrailTopicPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopicPolicyConfig",
    0,
    ["topicsConfig", "tierConfig"],
    [[() => GuardrailTopicsConfig, 0], [() => GuardrailTopicsTierConfig$, 0]],
    1
  ], GuardrailTopicsTier$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopicsTier",
    0,
    ["tierName"],
    [[() => GuardrailTopicsTierName, 0]],
    1
  ], GuardrailTopicsTierConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailTopicsTierConfig",
    0,
    ["tierName"],
    [[() => GuardrailTopicsTierName, 0]],
    1
  ], GuardrailWord$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailWord",
    0,
    ["text", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, [() => GuardrailWordAction, 0], [() => GuardrailWordAction, 0], 2, 2],
    1
  ], GuardrailWordConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailWordConfig",
    0,
    ["text", "inputAction", "outputAction", "inputEnabled", "outputEnabled"],
    [0, [() => GuardrailWordAction, 0], [() => GuardrailWordAction, 0], 2, 2],
    1
  ], GuardrailWordPolicy$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailWordPolicy",
    0,
    ["words", "managedWordLists"],
    [[() => GuardrailWords, 0], [() => GuardrailManagedWordLists, 0]]
  ], GuardrailWordPolicyConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "GuardrailWordPolicyConfig",
    0,
    ["wordsConfig", "managedWordListsConfig"],
    [[() => GuardrailWordsConfig, 0], [() => GuardrailManagedWordListsConfig, 0]]
  ], HumanEvaluationConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "HumanEvaluationConfig",
    0,
    ["datasetMetricConfigs", "humanWorkflowConfig", "customMetrics"],
    [[() => EvaluationDatasetMetricConfigs, 0], [() => HumanWorkflowConfig$, 0], [() => HumanEvaluationCustomMetrics, 0]],
    1
  ], HumanEvaluationCustomMetric$ = [
    3,
    "com.amazonaws.bedrock",
    "HumanEvaluationCustomMetric",
    0,
    ["name", "ratingMethod", "description"],
    [[() => EvaluationMetricName, 0], 0, [() => EvaluationMetricDescription, 0]],
    2
  ], HumanWorkflowConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "HumanWorkflowConfig",
    0,
    ["flowDefinitionArn", "instructions"],
    [0, [() => HumanTaskInstructions, 0]],
    1
  ], ImplicitFilterConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "ImplicitFilterConfiguration",
    0,
    ["metadataAttributes", "modelArn"],
    [[() => MetadataAttributeSchemaList, 0], 0],
    2
  ], ImportedModelSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ImportedModelSummary",
    0,
    ["modelArn", "modelName", "creationTime", "instructSupported", "modelArchitecture"],
    [0, 0, 5, 2, 0],
    3
  ], InferenceProfileModel$ = [
    3,
    "com.amazonaws.bedrock",
    "InferenceProfileModel",
    0,
    ["modelArn"],
    [0]
  ], InferenceProfileSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "InferenceProfileSummary",
    0,
    ["inferenceProfileName", "inferenceProfileArn", "models", "inferenceProfileId", "status", "type", "description", "createdAt", "updatedAt"],
    [0, 0, () => InferenceProfileModels, 0, 0, 0, [() => InferenceProfileDescription, 0], 5, 5],
    6
  ], InvocationLogsConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "InvocationLogsConfig",
    0,
    ["invocationLogSource", "usePromptResponse", "requestMetadataFilters"],
    [() => InvocationLogSource$, 2, [() => RequestMetadataFilters$, 0]],
    1
  ], KbInferenceConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "KbInferenceConfig",
    0,
    ["textInferenceConfig"],
    [() => TextInferenceConfig$]
  ], KnowledgeBaseRetrievalConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "KnowledgeBaseRetrievalConfiguration",
    0,
    ["vectorSearchConfiguration"],
    [[() => KnowledgeBaseVectorSearchConfiguration$, 0]],
    1
  ], KnowledgeBaseRetrieveAndGenerateConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "KnowledgeBaseRetrieveAndGenerateConfiguration",
    0,
    ["knowledgeBaseId", "modelArn", "retrievalConfiguration", "generationConfiguration", "orchestrationConfiguration"],
    [0, 0, [() => KnowledgeBaseRetrievalConfiguration$, 0], [() => GenerationConfiguration$, 0], () => OrchestrationConfiguration$],
    2
  ], KnowledgeBaseVectorSearchConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "KnowledgeBaseVectorSearchConfiguration",
    0,
    ["numberOfResults", "overrideSearchType", "filter", "implicitFilterConfiguration", "rerankingConfiguration"],
    [1, 0, [() => RetrievalFilter$, 0], [() => ImplicitFilterConfiguration$, 0], [() => VectorSearchRerankingConfiguration$, 0]]
  ], LambdaGraderConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "LambdaGraderConfig",
    0,
    ["lambdaArn"],
    [0],
    1
  ], LegalTerm$ = [
    3,
    "com.amazonaws.bedrock",
    "LegalTerm",
    0,
    ["url"],
    [0]
  ], ListAutomatedReasoningPoliciesRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPoliciesRequest",
    0,
    ["policyArn", "nextToken", "maxResults"],
    [[0, { ["httpQuery"]: "policyArn" }], [0, { ["httpQuery"]: "nextToken" }], [1, { ["httpQuery"]: "maxResults" }]]
  ], ListAutomatedReasoningPoliciesResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPoliciesResponse",
    0,
    ["automatedReasoningPolicySummaries", "nextToken"],
    [[() => AutomatedReasoningPolicySummaries, 0], 0],
    1
  ], ListAutomatedReasoningPolicyBuildWorkflowsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyBuildWorkflowsRequest",
    0,
    ["policyArn", "nextToken", "maxResults"],
    [[0, 1], [0, { ["httpQuery"]: "nextToken" }], [1, { ["httpQuery"]: "maxResults" }]],
    1
  ], ListAutomatedReasoningPolicyBuildWorkflowsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyBuildWorkflowsResponse",
    0,
    ["automatedReasoningPolicyBuildWorkflowSummaries", "nextToken"],
    [() => AutomatedReasoningPolicyBuildWorkflowSummaries, 0],
    1
  ], ListAutomatedReasoningPolicyTestCasesRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestCasesRequest",
    0,
    ["policyArn", "nextToken", "maxResults"],
    [[0, 1], [0, { ["httpQuery"]: "nextToken" }], [1, { ["httpQuery"]: "maxResults" }]],
    1
  ], ListAutomatedReasoningPolicyTestCasesResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestCasesResponse",
    0,
    ["testCases", "nextToken"],
    [[() => AutomatedReasoningPolicyTestCaseList, 0], 0],
    1
  ], ListAutomatedReasoningPolicyTestResultsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestResultsRequest",
    0,
    ["policyArn", "buildWorkflowId", "nextToken", "maxResults"],
    [[0, 1], [0, 1], [0, { ["httpQuery"]: "nextToken" }], [1, { ["httpQuery"]: "maxResults" }]],
    2
  ], ListAutomatedReasoningPolicyTestResultsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestResultsResponse",
    0,
    ["testResults", "nextToken"],
    [[() => AutomatedReasoningPolicyTestList, 0], 0],
    1
  ], ListCustomModelDeploymentsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListCustomModelDeploymentsRequest",
    0,
    ["createdBefore", "createdAfter", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder", "statusEquals", "modelArnEquals"],
    [[5, { ["httpQuery"]: "createdBefore" }], [5, { ["httpQuery"]: "createdAfter" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "modelArnEquals" }]]
  ], ListCustomModelDeploymentsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListCustomModelDeploymentsResponse",
    0,
    ["nextToken", "modelDeploymentSummaries"],
    [0, () => CustomModelDeploymentSummaryList]
  ], ListCustomModelsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListCustomModelsRequest",
    0,
    ["creationTimeBefore", "creationTimeAfter", "nameContains", "baseModelArnEquals", "foundationModelArnEquals", "maxResults", "nextToken", "sortBy", "sortOrder", "isOwned", "modelStatus"],
    [[5, { ["httpQuery"]: "creationTimeBefore" }], [5, { ["httpQuery"]: "creationTimeAfter" }], [0, { ["httpQuery"]: "nameContains" }], [0, { ["httpQuery"]: "baseModelArnEquals" }], [0, { ["httpQuery"]: "foundationModelArnEquals" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }], [2, { ["httpQuery"]: "isOwned" }], [0, { ["httpQuery"]: "modelStatus" }]]
  ], ListCustomModelsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListCustomModelsResponse",
    0,
    ["nextToken", "modelSummaries"],
    [0, () => CustomModelSummaryList]
  ], ListEnforcedGuardrailsConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListEnforcedGuardrailsConfigurationRequest",
    0,
    ["nextToken"],
    [[0, { ["httpQuery"]: "nextToken" }]]
  ], ListEnforcedGuardrailsConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListEnforcedGuardrailsConfigurationResponse",
    0,
    ["guardrailsConfig", "nextToken"],
    [() => AccountEnforcedGuardrailsOutputConfiguration, 0],
    1
  ], ListEvaluationJobsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListEvaluationJobsRequest",
    0,
    ["creationTimeAfter", "creationTimeBefore", "statusEquals", "applicationTypeEquals", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeAfter" }], [5, { ["httpQuery"]: "creationTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "applicationTypeEquals" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListEvaluationJobsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListEvaluationJobsResponse",
    0,
    ["nextToken", "jobSummaries"],
    [0, () => EvaluationSummaries]
  ], ListFoundationModelAgreementOffersRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListFoundationModelAgreementOffersRequest",
    0,
    ["modelId", "offerType"],
    [[0, 1], [0, { ["httpQuery"]: "offerType" }]],
    1
  ], ListFoundationModelAgreementOffersResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListFoundationModelAgreementOffersResponse",
    0,
    ["modelId", "offers"],
    [0, () => Offers],
    2
  ], ListFoundationModelsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListFoundationModelsRequest",
    0,
    ["byProvider", "byCustomizationType", "byOutputModality", "byInferenceType"],
    [[0, { ["httpQuery"]: "byProvider" }], [0, { ["httpQuery"]: "byCustomizationType" }], [0, { ["httpQuery"]: "byOutputModality" }], [0, { ["httpQuery"]: "byInferenceType" }]]
  ], ListFoundationModelsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListFoundationModelsResponse",
    0,
    ["modelSummaries"],
    [() => FoundationModelSummaryList]
  ], ListGuardrailsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListGuardrailsRequest",
    0,
    ["guardrailIdentifier", "maxResults", "nextToken"],
    [[0, { ["httpQuery"]: "guardrailIdentifier" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }]]
  ], ListGuardrailsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListGuardrailsResponse",
    0,
    ["guardrails", "nextToken"],
    [[() => GuardrailSummaries, 0], 0],
    1
  ], ListImportedModelsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListImportedModelsRequest",
    0,
    ["creationTimeBefore", "creationTimeAfter", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeBefore" }], [5, { ["httpQuery"]: "creationTimeAfter" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListImportedModelsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListImportedModelsResponse",
    0,
    ["nextToken", "modelSummaries"],
    [0, () => ImportedModelSummaryList]
  ], ListInferenceProfilesRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListInferenceProfilesRequest",
    0,
    ["maxResults", "nextToken", "typeEquals"],
    [[1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "type" }]]
  ], ListInferenceProfilesResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListInferenceProfilesResponse",
    0,
    ["inferenceProfileSummaries", "nextToken"],
    [[() => InferenceProfileSummaries, 0], 0]
  ], ListMarketplaceModelEndpointsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListMarketplaceModelEndpointsRequest",
    0,
    ["maxResults", "nextToken", "modelSourceEquals"],
    [[1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "modelSourceIdentifier" }]]
  ], ListMarketplaceModelEndpointsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListMarketplaceModelEndpointsResponse",
    0,
    ["marketplaceModelEndpoints", "nextToken"],
    [() => MarketplaceModelEndpointSummaries, 0]
  ], ListModelCopyJobsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelCopyJobsRequest",
    0,
    ["creationTimeAfter", "creationTimeBefore", "statusEquals", "sourceAccountEquals", "sourceModelArnEquals", "targetModelNameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeAfter" }], [5, { ["httpQuery"]: "creationTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "sourceAccountEquals" }], [0, { ["httpQuery"]: "sourceModelArnEquals" }], [0, { ["httpQuery"]: "outputModelNameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListModelCopyJobsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelCopyJobsResponse",
    0,
    ["nextToken", "modelCopyJobSummaries"],
    [0, () => ModelCopyJobSummaries]
  ], ListModelCustomizationJobsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelCustomizationJobsRequest",
    0,
    ["creationTimeAfter", "creationTimeBefore", "statusEquals", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeAfter" }], [5, { ["httpQuery"]: "creationTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListModelCustomizationJobsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelCustomizationJobsResponse",
    0,
    ["nextToken", "modelCustomizationJobSummaries"],
    [0, () => ModelCustomizationJobSummaries]
  ], ListModelImportJobsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelImportJobsRequest",
    0,
    ["creationTimeAfter", "creationTimeBefore", "statusEquals", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeAfter" }], [5, { ["httpQuery"]: "creationTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListModelImportJobsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelImportJobsResponse",
    0,
    ["nextToken", "modelImportJobSummaries"],
    [0, () => ModelImportJobSummaries]
  ], ListModelInvocationJobsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelInvocationJobsRequest",
    0,
    ["submitTimeAfter", "submitTimeBefore", "statusEquals", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "submitTimeAfter" }], [5, { ["httpQuery"]: "submitTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListModelInvocationJobsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListModelInvocationJobsResponse",
    0,
    ["nextToken", "invocationJobSummaries"],
    [0, [() => ModelInvocationJobSummaries, 0]]
  ], ListPromptRoutersRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListPromptRoutersRequest",
    0,
    ["maxResults", "nextToken", "type"],
    [[1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "type" }]]
  ], ListPromptRoutersResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListPromptRoutersResponse",
    0,
    ["promptRouterSummaries", "nextToken"],
    [[() => PromptRouterSummaries, 0], 0]
  ], ListProvisionedModelThroughputsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListProvisionedModelThroughputsRequest",
    0,
    ["creationTimeAfter", "creationTimeBefore", "statusEquals", "modelArnEquals", "nameContains", "maxResults", "nextToken", "sortBy", "sortOrder"],
    [[5, { ["httpQuery"]: "creationTimeAfter" }], [5, { ["httpQuery"]: "creationTimeBefore" }], [0, { ["httpQuery"]: "statusEquals" }], [0, { ["httpQuery"]: "modelArnEquals" }], [0, { ["httpQuery"]: "nameContains" }], [1, { ["httpQuery"]: "maxResults" }], [0, { ["httpQuery"]: "nextToken" }], [0, { ["httpQuery"]: "sortBy" }], [0, { ["httpQuery"]: "sortOrder" }]]
  ], ListProvisionedModelThroughputsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListProvisionedModelThroughputsResponse",
    0,
    ["nextToken", "provisionedModelSummaries"],
    [0, () => ProvisionedModelSummaries]
  ], ListTagsForResourceRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "ListTagsForResourceRequest",
    0,
    ["resourceARN"],
    [0],
    1
  ], ListTagsForResourceResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "ListTagsForResourceResponse",
    0,
    ["tags"],
    [() => TagList]
  ], LoggingConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "LoggingConfig",
    0,
    ["cloudWatchConfig", "s3Config", "textDataDeliveryEnabled", "imageDataDeliveryEnabled", "embeddingDataDeliveryEnabled", "videoDataDeliveryEnabled", "audioDataDeliveryEnabled"],
    [() => CloudWatchConfig$, () => S3Config$, 2, 2, 2, 2, 2]
  ], MarketplaceModelEndpoint$ = [
    3,
    "com.amazonaws.bedrock",
    "MarketplaceModelEndpoint",
    0,
    ["endpointArn", "modelSourceIdentifier", "createdAt", "updatedAt", "endpointConfig", "endpointStatus", "status", "statusMessage", "endpointStatusMessage"],
    [0, 0, 5, 5, () => EndpointConfig$, 0, 0, 0, 0],
    6
  ], MarketplaceModelEndpointSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "MarketplaceModelEndpointSummary",
    0,
    ["endpointArn", "modelSourceIdentifier", "createdAt", "updatedAt", "status", "statusMessage"],
    [0, 0, 5, 5, 0, 0],
    4
  ], MetadataAttributeSchema$ = [
    3,
    "com.amazonaws.bedrock",
    "MetadataAttributeSchema",
    8,
    ["key", "type", "description"],
    [0, 0, 0],
    3
  ], MetadataConfigurationForReranking$ = [
    3,
    "com.amazonaws.bedrock",
    "MetadataConfigurationForReranking",
    0,
    ["selectionMode", "selectiveModeConfiguration"],
    [0, [() => RerankingMetadataSelectiveModeConfiguration$, 0]],
    1
  ], ModelCopyJobSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelCopyJobSummary",
    0,
    ["jobArn", "status", "creationTime", "targetModelArn", "sourceAccountId", "sourceModelArn", "targetModelName", "targetModelKmsKeyArn", "targetModelTags", "failureMessage", "sourceModelName"],
    [0, 0, 5, 0, 0, 0, 0, 0, () => TagList, 0, 0],
    6
  ], ModelCustomizationJobSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelCustomizationJobSummary",
    0,
    ["jobArn", "baseModelArn", "jobName", "status", "creationTime", "statusDetails", "lastModifiedTime", "endTime", "customModelArn", "customModelName", "customizationType"],
    [0, 0, 0, 0, 5, () => StatusDetails$, 5, 5, 0, 0, 0],
    5
  ], ModelEnforcement$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelEnforcement",
    0,
    ["includedModels", "excludedModels"],
    [64, 64],
    2
  ], ModelImportJobSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelImportJobSummary",
    0,
    ["jobArn", "jobName", "status", "creationTime", "lastModifiedTime", "endTime", "importedModelArn", "importedModelName"],
    [0, 0, 0, 5, 5, 5, 0, 0],
    4
  ], ModelInvocationJobS3InputDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelInvocationJobS3InputDataConfig",
    0,
    ["s3Uri", "s3InputFormat", "s3BucketOwner"],
    [0, 0, 0],
    1
  ], ModelInvocationJobS3OutputDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelInvocationJobS3OutputDataConfig",
    0,
    ["s3Uri", "s3EncryptionKeyId", "s3BucketOwner"],
    [0, 0, 0],
    1
  ], ModelInvocationJobSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ModelInvocationJobSummary",
    0,
    ["jobArn", "jobName", "modelId", "roleArn", "submitTime", "inputDataConfig", "outputDataConfig", "clientRequestToken", "status", "message", "lastModifiedTime", "endTime", "vpcConfig", "timeoutDurationInHours", "jobExpirationTime", "modelInvocationType", "totalRecordCount", "processedRecordCount", "successRecordCount", "errorRecordCount"],
    [0, 0, 0, 0, 5, () => ModelInvocationJobInputDataConfig$, () => ModelInvocationJobOutputDataConfig$, 0, 0, [() => Message, 0], 5, 5, () => VpcConfig$, 1, 5, 0, 1, 1, 1, 1],
    7
  ], Offer$ = [
    3,
    "com.amazonaws.bedrock",
    "Offer",
    0,
    ["offerToken", "termDetails", "offerId"],
    [0, () => TermDetails$, 0],
    2
  ], OrchestrationConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "OrchestrationConfiguration",
    0,
    ["queryTransformationConfiguration"],
    [() => QueryTransformationConfiguration$],
    1
  ], OutputDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "OutputDataConfig",
    0,
    ["s3Uri"],
    [0],
    1
  ], PerformanceConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "PerformanceConfiguration",
    0,
    ["latency"],
    [0]
  ], PricingTerm$ = [
    3,
    "com.amazonaws.bedrock",
    "PricingTerm",
    0,
    ["rateCard"],
    [() => RateCard],
    1
  ], PromptRouterSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "PromptRouterSummary",
    0,
    ["promptRouterName", "routingCriteria", "promptRouterArn", "models", "fallbackModel", "status", "type", "description", "createdAt", "updatedAt"],
    [0, () => RoutingCriteria$, 0, () => PromptRouterTargetModels, () => PromptRouterTargetModel$, 0, 0, [() => PromptRouterDescription, 0], 5, 5],
    7
  ], PromptRouterTargetModel$ = [
    3,
    "com.amazonaws.bedrock",
    "PromptRouterTargetModel",
    0,
    ["modelArn"],
    [0],
    1
  ], PromptTemplate$ = [
    3,
    "com.amazonaws.bedrock",
    "PromptTemplate",
    0,
    ["textPromptTemplate"],
    [[() => TextPromptTemplate, 0]]
  ], ProvisionedModelSummary$ = [
    3,
    "com.amazonaws.bedrock",
    "ProvisionedModelSummary",
    0,
    ["provisionedModelName", "provisionedModelArn", "modelArn", "desiredModelArn", "foundationModelArn", "modelUnits", "desiredModelUnits", "status", "creationTime", "lastModifiedTime", "commitmentDuration", "commitmentExpirationTime"],
    [0, 0, 0, 0, 0, 1, 1, 0, 5, 5, 0, 5],
    10
  ], PutEnforcedGuardrailConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "PutEnforcedGuardrailConfigurationRequest",
    0,
    ["guardrailInferenceConfig", "configId"],
    [() => AccountEnforcedGuardrailInferenceInputConfiguration$, 0],
    1
  ], PutEnforcedGuardrailConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "PutEnforcedGuardrailConfigurationResponse",
    0,
    ["configId", "updatedAt", "updatedBy"],
    [0, 5, 0]
  ], PutModelInvocationLoggingConfigurationRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "PutModelInvocationLoggingConfigurationRequest",
    0,
    ["loggingConfig"],
    [() => LoggingConfig$],
    1
  ], PutModelInvocationLoggingConfigurationResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "PutModelInvocationLoggingConfigurationResponse",
    0,
    [],
    []
  ], PutResourcePolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "PutResourcePolicyRequest",
    0,
    ["resourceArn", "resourcePolicy"],
    [0, 0],
    2
  ], PutResourcePolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "PutResourcePolicyResponse",
    0,
    ["resourceArn"],
    [0]
  ], PutUseCaseForModelAccessRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "PutUseCaseForModelAccessRequest",
    0,
    ["formData"],
    [21],
    1
  ], PutUseCaseForModelAccessResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "PutUseCaseForModelAccessResponse",
    0,
    [],
    []
  ], QueryTransformationConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "QueryTransformationConfiguration",
    0,
    ["type"],
    [0],
    1
  ], RatingScaleItem$ = [
    3,
    "com.amazonaws.bedrock",
    "RatingScaleItem",
    0,
    ["definition", "value"],
    [0, () => RatingScaleItemValue$],
    2
  ], RegisterMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "RegisterMarketplaceModelEndpointRequest",
    0,
    ["endpointIdentifier", "modelSourceIdentifier"],
    [[0, 1], 0],
    2
  ], RegisterMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "RegisterMarketplaceModelEndpointResponse",
    0,
    ["marketplaceModelEndpoint"],
    [() => MarketplaceModelEndpoint$],
    1
  ], RequestMetadataBaseFilters$ = [
    3,
    "com.amazonaws.bedrock",
    "RequestMetadataBaseFilters",
    0,
    ["equals", "notEquals"],
    [[() => RequestMetadataMap, 0], [() => RequestMetadataMap, 0]]
  ], RetrieveAndGenerateConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "RetrieveAndGenerateConfiguration",
    0,
    ["type", "knowledgeBaseConfiguration", "externalSourcesConfiguration"],
    [0, [() => KnowledgeBaseRetrieveAndGenerateConfiguration$, 0], [() => ExternalSourcesRetrieveAndGenerateConfiguration$, 0]],
    1
  ], RetrieveConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "RetrieveConfig",
    0,
    ["knowledgeBaseId", "knowledgeBaseRetrievalConfiguration"],
    [0, [() => KnowledgeBaseRetrievalConfiguration$, 0]],
    2
  ], RFTConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "RFTConfig",
    0,
    ["graderConfig", "hyperParameters"],
    [() => GraderConfig$, () => RFTHyperParameters$]
  ], RFTHyperParameters$ = [
    3,
    "com.amazonaws.bedrock",
    "RFTHyperParameters",
    0,
    ["epochCount", "batchSize", "learningRate", "maxPromptLength", "trainingSamplePerPrompt", "inferenceMaxTokens", "reasoningEffort", "evalInterval"],
    [1, 1, 1, 1, 1, 1, 0, 1]
  ], RoutingCriteria$ = [
    3,
    "com.amazonaws.bedrock",
    "RoutingCriteria",
    0,
    ["responseQualityDifference"],
    [1],
    1
  ], S3Config$ = [
    3,
    "com.amazonaws.bedrock",
    "S3Config",
    0,
    ["bucketName", "keyPrefix"],
    [0, 0],
    1
  ], S3DataSource$ = [
    3,
    "com.amazonaws.bedrock",
    "S3DataSource",
    0,
    ["s3Uri"],
    [0],
    1
  ], S3ObjectDoc$ = [
    3,
    "com.amazonaws.bedrock",
    "S3ObjectDoc",
    0,
    ["uri"],
    [0],
    1
  ], SageMakerEndpoint$ = [
    3,
    "com.amazonaws.bedrock",
    "SageMakerEndpoint",
    0,
    ["initialInstanceCount", "instanceType", "executionRole", "kmsEncryptionKey", "vpc"],
    [1, 0, 0, 0, () => VpcConfig$],
    3
  ], SelectiveContentGuarding$ = [
    3,
    "com.amazonaws.bedrock",
    "SelectiveContentGuarding",
    0,
    ["system", "messages"],
    [0, 0]
  ], StartAutomatedReasoningPolicyBuildWorkflowRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyBuildWorkflowRequest",
    0,
    ["policyArn", "buildWorkflowType", "sourceContent", "clientRequestToken"],
    [[0, 1], [0, 1], [() => AutomatedReasoningPolicyBuildWorkflowSource$, 16], [0, { ["httpHeader"]: "x-amz-client-token", ["idempotencyToken"]: 1 }]],
    3
  ], StartAutomatedReasoningPolicyBuildWorkflowResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyBuildWorkflowResponse",
    0,
    ["policyArn", "buildWorkflowId"],
    [0, 0],
    2
  ], StartAutomatedReasoningPolicyTestWorkflowRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyTestWorkflowRequest",
    0,
    ["policyArn", "buildWorkflowId", "testCaseIds", "clientRequestToken"],
    [[0, 1], [0, 1], 64, [0, 4]],
    2
  ], StartAutomatedReasoningPolicyTestWorkflowResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyTestWorkflowResponse",
    0,
    ["policyArn"],
    [0],
    1
  ], StatusDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "StatusDetails",
    0,
    ["validationDetails", "dataProcessingDetails", "trainingDetails"],
    [() => ValidationDetails$, () => DataProcessingDetails$, () => TrainingDetails$]
  ], StopEvaluationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "StopEvaluationJobRequest",
    0,
    ["jobIdentifier"],
    [[() => EvaluationJobIdentifier, 1]],
    1
  ], StopEvaluationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "StopEvaluationJobResponse",
    0,
    [],
    []
  ], StopModelCustomizationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "StopModelCustomizationJobRequest",
    0,
    ["jobIdentifier"],
    [[0, 1]],
    1
  ], StopModelCustomizationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "StopModelCustomizationJobResponse",
    0,
    [],
    []
  ], StopModelInvocationJobRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "StopModelInvocationJobRequest",
    0,
    ["jobIdentifier"],
    [[0, 1]],
    1
  ], StopModelInvocationJobResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "StopModelInvocationJobResponse",
    0,
    [],
    []
  ], SupportTerm$ = [
    3,
    "com.amazonaws.bedrock",
    "SupportTerm",
    0,
    ["refundPolicyDescription"],
    [0]
  ], Tag$ = [
    3,
    "com.amazonaws.bedrock",
    "Tag",
    0,
    ["key", "value"],
    [0, 0],
    2
  ], TagResourceRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "TagResourceRequest",
    0,
    ["resourceARN", "tags"],
    [0, () => TagList],
    2
  ], TagResourceResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "TagResourceResponse",
    0,
    [],
    []
  ], TeacherModelConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "TeacherModelConfig",
    0,
    ["teacherModelIdentifier", "maxResponseLengthForInference"],
    [0, 1],
    1
  ], TermDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "TermDetails",
    0,
    ["usageBasedPricingTerm", "legalTerm", "supportTerm", "validityTerm"],
    [() => PricingTerm$, () => LegalTerm$, () => SupportTerm$, () => ValidityTerm$],
    3
  ], TextInferenceConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "TextInferenceConfig",
    0,
    ["temperature", "topP", "maxTokens", "stopSequences"],
    [1, 1, 1, 64]
  ], TrainingDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "TrainingDataConfig",
    0,
    ["s3Uri", "invocationLogsConfig"],
    [0, [() => InvocationLogsConfig$, 0]]
  ], TrainingDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "TrainingDetails",
    0,
    ["status", "creationTime", "lastModifiedTime"],
    [0, 5, 5]
  ], TrainingMetrics$ = [
    3,
    "com.amazonaws.bedrock",
    "TrainingMetrics",
    0,
    ["trainingLoss"],
    [1]
  ], UntagResourceRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UntagResourceRequest",
    0,
    ["resourceARN", "tagKeys"],
    [0, 64],
    2
  ], UntagResourceResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UntagResourceResponse",
    0,
    [],
    []
  ], UpdateAutomatedReasoningPolicyAnnotationsRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyAnnotationsRequest",
    0,
    ["policyArn", "buildWorkflowId", "annotations", "lastUpdatedAnnotationSetHash"],
    [[0, 1], [0, 1], [() => AutomatedReasoningPolicyAnnotationList, 0], 0],
    4
  ], UpdateAutomatedReasoningPolicyAnnotationsResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyAnnotationsResponse",
    0,
    ["policyArn", "buildWorkflowId", "annotationSetHash", "updatedAt"],
    [0, 0, 0, 5],
    4
  ], UpdateAutomatedReasoningPolicyRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyRequest",
    0,
    ["policyArn", "policyDefinition", "name", "description"],
    [[0, 1], [() => AutomatedReasoningPolicyDefinition$, 0], [() => AutomatedReasoningPolicyName, 0], [() => AutomatedReasoningPolicyDescription, 0]],
    2
  ], UpdateAutomatedReasoningPolicyResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyResponse",
    0,
    ["policyArn", "name", "definitionHash", "updatedAt"],
    [0, [() => AutomatedReasoningPolicyName, 0], 0, 5],
    4
  ], UpdateAutomatedReasoningPolicyTestCaseRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyTestCaseRequest",
    0,
    ["policyArn", "testCaseId", "guardContent", "lastUpdatedAt", "expectedAggregatedFindingsResult", "queryContent", "confidenceThreshold", "clientRequestToken"],
    [[0, 1], [0, 1], [() => AutomatedReasoningPolicyTestGuardContent, 0], 5, 0, [() => AutomatedReasoningPolicyTestQueryContent, 0], 1, [0, 4]],
    5
  ], UpdateAutomatedReasoningPolicyTestCaseResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyTestCaseResponse",
    0,
    ["policyArn", "testCaseId"],
    [0, 0],
    2
  ], UpdateCustomModelDeploymentRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateCustomModelDeploymentRequest",
    0,
    ["modelArn", "customModelDeploymentIdentifier"],
    [0, [0, 1]],
    2
  ], UpdateCustomModelDeploymentResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateCustomModelDeploymentResponse",
    0,
    ["customModelDeploymentArn"],
    [0],
    1
  ], UpdateGuardrailRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateGuardrailRequest",
    0,
    ["guardrailIdentifier", "name", "blockedInputMessaging", "blockedOutputsMessaging", "description", "topicPolicyConfig", "contentPolicyConfig", "wordPolicyConfig", "sensitiveInformationPolicyConfig", "contextualGroundingPolicyConfig", "automatedReasoningPolicyConfig", "crossRegionConfig", "kmsKeyId"],
    [[0, 1], [() => GuardrailName, 0], [() => GuardrailBlockedMessaging, 0], [() => GuardrailBlockedMessaging, 0], [() => GuardrailDescription, 0], [() => GuardrailTopicPolicyConfig$, 0], [() => GuardrailContentPolicyConfig$, 0], [() => GuardrailWordPolicyConfig$, 0], () => GuardrailSensitiveInformationPolicyConfig$, [() => GuardrailContextualGroundingPolicyConfig$, 0], () => GuardrailAutomatedReasoningPolicyConfig$, () => GuardrailCrossRegionConfig$, 0],
    4
  ], UpdateGuardrailResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateGuardrailResponse",
    0,
    ["guardrailId", "guardrailArn", "version", "updatedAt"],
    [0, 0, 0, 5],
    4
  ], UpdateMarketplaceModelEndpointRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateMarketplaceModelEndpointRequest",
    0,
    ["endpointArn", "endpointConfig", "clientRequestToken"],
    [[0, 1], () => EndpointConfig$, [0, 4]],
    2
  ], UpdateMarketplaceModelEndpointResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateMarketplaceModelEndpointResponse",
    0,
    ["marketplaceModelEndpoint"],
    [() => MarketplaceModelEndpoint$],
    1
  ], UpdateProvisionedModelThroughputRequest$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateProvisionedModelThroughputRequest",
    0,
    ["provisionedModelId", "desiredProvisionedModelName", "desiredModelId"],
    [[0, 1], 0, 0],
    1
  ], UpdateProvisionedModelThroughputResponse$ = [
    3,
    "com.amazonaws.bedrock",
    "UpdateProvisionedModelThroughputResponse",
    0,
    [],
    []
  ], ValidationDataConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "ValidationDataConfig",
    0,
    ["validators"],
    [() => Validators],
    1
  ], ValidationDetails$ = [
    3,
    "com.amazonaws.bedrock",
    "ValidationDetails",
    0,
    ["status", "creationTime", "lastModifiedTime"],
    [0, 5, 5]
  ], Validator$ = [
    3,
    "com.amazonaws.bedrock",
    "Validator",
    0,
    ["s3Uri"],
    [0],
    1
  ], ValidatorMetric$ = [
    3,
    "com.amazonaws.bedrock",
    "ValidatorMetric",
    0,
    ["validationLoss"],
    [1]
  ], ValidityTerm$ = [
    3,
    "com.amazonaws.bedrock",
    "ValidityTerm",
    0,
    ["agreementDuration"],
    [0]
  ], VectorSearchBedrockRerankingConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "VectorSearchBedrockRerankingConfiguration",
    0,
    ["modelConfiguration", "numberOfRerankedResults", "metadataConfiguration"],
    [() => VectorSearchBedrockRerankingModelConfiguration$, 1, [() => MetadataConfigurationForReranking$, 0]],
    1
  ], VectorSearchBedrockRerankingModelConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "VectorSearchBedrockRerankingModelConfiguration",
    0,
    ["modelArn", "additionalModelRequestFields"],
    [0, 143],
    1
  ], VectorSearchRerankingConfiguration$ = [
    3,
    "com.amazonaws.bedrock",
    "VectorSearchRerankingConfiguration",
    0,
    ["type", "bedrockRerankingConfiguration"],
    [0, [() => VectorSearchBedrockRerankingConfiguration$, 0]],
    1
  ], VpcConfig$ = [
    3,
    "com.amazonaws.bedrock",
    "VpcConfig",
    0,
    ["subnetIds", "securityGroupIds"],
    [64, 64],
    2
  ], AccountEnforcedGuardrailsOutputConfiguration = [
    1,
    "com.amazonaws.bedrock",
    "AccountEnforcedGuardrailsOutputConfiguration",
    0,
    () => AccountEnforcedGuardrailOutputConfiguration$
  ], AutomatedEvaluationCustomMetrics = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedEvaluationCustomMetrics",
    0,
    [
      () => AutomatedEvaluationCustomMetricSource$,
      0
    ]
  ], AutomatedReasoningCheckDifferenceScenarioList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckDifferenceScenarioList",
    0,
    [
      () => AutomatedReasoningCheckScenario$,
      0
    ]
  ], AutomatedReasoningCheckFindingList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckFindingList",
    0,
    [
      () => AutomatedReasoningCheckFinding$,
      0
    ]
  ], AutomatedReasoningCheckInputTextReferenceList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckInputTextReferenceList",
    0,
    [
      () => AutomatedReasoningCheckInputTextReference$,
      0
    ]
  ], AutomatedReasoningCheckRuleList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckRuleList",
    0,
    () => AutomatedReasoningCheckRule$
  ], AutomatedReasoningCheckTranslationList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTranslationList",
    0,
    [
      () => AutomatedReasoningCheckTranslation$,
      0
    ]
  ], AutomatedReasoningCheckTranslationOptionList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckTranslationOptionList",
    0,
    [
      () => AutomatedReasoningCheckTranslationOption$,
      0
    ]
  ], AutomatedReasoningLogicStatementList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningLogicStatementList",
    0,
    [
      () => AutomatedReasoningLogicStatement$,
      0
    ]
  ], AutomatedReasoningPolicyAnnotatedChunkList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotatedChunkList",
    0,
    [
      () => AutomatedReasoningPolicyAnnotatedChunk$,
      0
    ]
  ], AutomatedReasoningPolicyAnnotatedContentList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotatedContentList",
    0,
    [
      () => AutomatedReasoningPolicyAnnotatedContent$,
      0
    ]
  ], AutomatedReasoningPolicyAnnotationList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotationList",
    0,
    [
      () => AutomatedReasoningPolicyAnnotation$,
      0
    ]
  ], AutomatedReasoningPolicyAtomicStatementList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAtomicStatementList",
    0,
    [
      () => AutomatedReasoningPolicyAtomicStatement$,
      0
    ]
  ], AutomatedReasoningPolicyBuildLogEntryList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildLogEntryList",
    0,
    [
      () => AutomatedReasoningPolicyBuildLogEntry$,
      0
    ]
  ], AutomatedReasoningPolicyBuildResultAssetManifestList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildResultAssetManifestList",
    0,
    [
      () => AutomatedReasoningPolicyBuildResultAssetManifestEntry$,
      0
    ]
  ], AutomatedReasoningPolicyBuildStepList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildStepList",
    0,
    [
      () => AutomatedReasoningPolicyBuildStep$,
      0
    ]
  ], AutomatedReasoningPolicyBuildStepMessageList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildStepMessageList",
    0,
    () => AutomatedReasoningPolicyBuildStepMessage$
  ], AutomatedReasoningPolicyBuildWorkflowDocumentList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowDocumentList",
    0,
    [
      () => AutomatedReasoningPolicyBuildWorkflowDocument$,
      0
    ]
  ], AutomatedReasoningPolicyBuildWorkflowSummaries = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildWorkflowSummaries",
    0,
    () => AutomatedReasoningPolicyBuildWorkflowSummary$
  ], AutomatedReasoningPolicyDefinitionRuleList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionRuleList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionRule$,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionTypeList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionType$,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionTypeNameList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeNameList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionTypeName,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionTypeValueList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeValueList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionTypeValue$,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionTypeValuePairList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionTypeValuePairList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionTypeValuePair$,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionVariableList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionVariableList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionVariable$,
      0
    ]
  ], AutomatedReasoningPolicyDefinitionVariableNameList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionVariableNameList",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionVariableName,
      0
    ]
  ], AutomatedReasoningPolicyDisjointRuleSetList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDisjointRuleSetList",
    0,
    [
      () => AutomatedReasoningPolicyDisjointRuleSet$,
      0
    ]
  ], AutomatedReasoningPolicyGeneratedTestCaseList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyGeneratedTestCaseList",
    0,
    [
      () => AutomatedReasoningPolicyGeneratedTestCase$,
      0
    ]
  ], AutomatedReasoningPolicyGenerateFidelityReportDocumentList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyGenerateFidelityReportDocumentList",
    0,
    [
      () => AutomatedReasoningPolicyBuildWorkflowDocument$,
      0
    ]
  ], AutomatedReasoningPolicyJustificationList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyJustificationList",
    0,
    [
      () => AutomatedReasoningPolicyJustificationText,
      0
    ]
  ], AutomatedReasoningPolicyReportSourceDocumentList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyReportSourceDocumentList",
    0,
    [
      () => AutomatedReasoningPolicyReportSourceDocument$,
      0
    ]
  ], AutomatedReasoningPolicyScenarioList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyScenarioList",
    0,
    [
      () => AutomatedReasoningPolicyScenario$,
      0
    ]
  ], AutomatedReasoningPolicyStatementReferenceList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyStatementReferenceList",
    0,
    () => AutomatedReasoningPolicyStatementReference$
  ], AutomatedReasoningPolicySummaries = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicySummaries",
    0,
    [
      () => AutomatedReasoningPolicySummary$,
      0
    ]
  ], AutomatedReasoningPolicyTestCaseList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTestCaseList",
    0,
    [
      () => AutomatedReasoningPolicyTestCase$,
      0
    ]
  ], AutomatedReasoningPolicyTestList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTestList",
    0,
    [
      () => AutomatedReasoningPolicyTestResult$,
      0
    ]
  ], AutomatedReasoningPolicyTypeValueAnnotationList = [
    1,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTypeValueAnnotationList",
    0,
    [
      () => AutomatedReasoningPolicyTypeValueAnnotation$,
      0
    ]
  ], BatchDeleteEvaluationJobErrors = [
    1,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobErrors",
    0,
    [
      () => BatchDeleteEvaluationJobError$,
      0
    ]
  ], BatchDeleteEvaluationJobItems = [
    1,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJobItems",
    0,
    [
      () => BatchDeleteEvaluationJobItem$,
      0
    ]
  ], BedrockEvaluatorModels = [
    1,
    "com.amazonaws.bedrock",
    "BedrockEvaluatorModels",
    0,
    () => BedrockEvaluatorModel$
  ], CustomMetricBedrockEvaluatorModels = [
    1,
    "com.amazonaws.bedrock",
    "CustomMetricBedrockEvaluatorModels",
    0,
    () => CustomMetricBedrockEvaluatorModel$
  ], CustomModelDeploymentSummaryList = [
    1,
    "com.amazonaws.bedrock",
    "CustomModelDeploymentSummaryList",
    0,
    () => CustomModelDeploymentSummary$
  ], CustomModelSummaryList = [
    1,
    "com.amazonaws.bedrock",
    "CustomModelSummaryList",
    0,
    () => CustomModelSummary$
  ], EvaluationDatasetMetricConfigs = [
    1,
    "com.amazonaws.bedrock",
    "EvaluationDatasetMetricConfigs",
    0,
    [
      () => EvaluationDatasetMetricConfig$,
      0
    ]
  ], EvaluationJobIdentifiers = [
    1,
    "com.amazonaws.bedrock",
    "EvaluationJobIdentifiers",
    0,
    [
      () => EvaluationJobIdentifier,
      0
    ]
  ], EvaluationMetricNames = [
    1,
    "com.amazonaws.bedrock",
    "EvaluationMetricNames",
    0,
    [
      () => EvaluationMetricName,
      0
    ]
  ], EvaluationModelConfigs = [
    1,
    "com.amazonaws.bedrock",
    "EvaluationModelConfigs",
    0,
    [
      () => EvaluationModelConfig$,
      0
    ]
  ], EvaluationSummaries = [
    1,
    "com.amazonaws.bedrock",
    "EvaluationSummaries",
    0,
    () => EvaluationSummary$
  ], ExternalSources = [
    1,
    "com.amazonaws.bedrock",
    "ExternalSources",
    0,
    [
      () => ExternalSource$,
      0
    ]
  ], FieldsForReranking = [
    1,
    "com.amazonaws.bedrock",
    "FieldsForReranking",
    8,
    () => FieldForReranking$
  ], FoundationModelSummaryList = [
    1,
    "com.amazonaws.bedrock",
    "FoundationModelSummaryList",
    0,
    () => FoundationModelSummary$
  ], GuardrailContentFilters = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailContentFilters",
    0,
    [
      () => GuardrailContentFilter$,
      0
    ]
  ], GuardrailContentFiltersConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailContentFiltersConfig",
    0,
    [
      () => GuardrailContentFilterConfig$,
      0
    ]
  ], GuardrailContextualGroundingFilters = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingFilters",
    0,
    [
      () => GuardrailContextualGroundingFilter$,
      0
    ]
  ], GuardrailContextualGroundingFiltersConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailContextualGroundingFiltersConfig",
    0,
    [
      () => GuardrailContextualGroundingFilterConfig$,
      0
    ]
  ], GuardrailFailureRecommendations = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailFailureRecommendations",
    0,
    [
      () => GuardrailFailureRecommendation,
      0
    ]
  ], GuardrailManagedWordLists = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailManagedWordLists",
    0,
    [
      () => GuardrailManagedWords$,
      0
    ]
  ], GuardrailManagedWordListsConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailManagedWordListsConfig",
    0,
    [
      () => GuardrailManagedWordsConfig$,
      0
    ]
  ], GuardrailModalities = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailModalities",
    0,
    [
      () => GuardrailModality,
      0
    ]
  ], GuardrailPiiEntities = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailPiiEntities",
    0,
    () => GuardrailPiiEntity$
  ], GuardrailPiiEntitiesConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailPiiEntitiesConfig",
    0,
    () => GuardrailPiiEntityConfig$
  ], GuardrailRegexes = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailRegexes",
    0,
    () => GuardrailRegex$
  ], GuardrailRegexesConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailRegexesConfig",
    0,
    () => GuardrailRegexConfig$
  ], GuardrailStatusReasons = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailStatusReasons",
    0,
    [
      () => GuardrailStatusReason,
      0
    ]
  ], GuardrailSummaries = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailSummaries",
    0,
    [
      () => GuardrailSummary$,
      0
    ]
  ], GuardrailTopicExamples = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailTopicExamples",
    0,
    [
      () => GuardrailTopicExample,
      0
    ]
  ], GuardrailTopics = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailTopics",
    0,
    [
      () => GuardrailTopic$,
      0
    ]
  ], GuardrailTopicsConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailTopicsConfig",
    0,
    [
      () => GuardrailTopicConfig$,
      0
    ]
  ], GuardrailWords = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailWords",
    0,
    [
      () => GuardrailWord$,
      0
    ]
  ], GuardrailWordsConfig = [
    1,
    "com.amazonaws.bedrock",
    "GuardrailWordsConfig",
    0,
    [
      () => GuardrailWordConfig$,
      0
    ]
  ], HumanEvaluationCustomMetrics = [
    1,
    "com.amazonaws.bedrock",
    "HumanEvaluationCustomMetrics",
    0,
    [
      () => HumanEvaluationCustomMetric$,
      0
    ]
  ], ImportedModelSummaryList = [
    1,
    "com.amazonaws.bedrock",
    "ImportedModelSummaryList",
    0,
    () => ImportedModelSummary$
  ], InferenceProfileModels = [
    1,
    "com.amazonaws.bedrock",
    "InferenceProfileModels",
    0,
    () => InferenceProfileModel$
  ], InferenceProfileSummaries = [
    1,
    "com.amazonaws.bedrock",
    "InferenceProfileSummaries",
    0,
    [
      () => InferenceProfileSummary$,
      0
    ]
  ], MarketplaceModelEndpointSummaries = [
    1,
    "com.amazonaws.bedrock",
    "MarketplaceModelEndpointSummaries",
    0,
    () => MarketplaceModelEndpointSummary$
  ], MetadataAttributeSchemaList = [
    1,
    "com.amazonaws.bedrock",
    "MetadataAttributeSchemaList",
    0,
    [
      () => MetadataAttributeSchema$,
      0
    ]
  ], ModelCopyJobSummaries = [
    1,
    "com.amazonaws.bedrock",
    "ModelCopyJobSummaries",
    0,
    () => ModelCopyJobSummary$
  ], ModelCustomizationJobSummaries = [
    1,
    "com.amazonaws.bedrock",
    "ModelCustomizationJobSummaries",
    0,
    () => ModelCustomizationJobSummary$
  ], ModelImportJobSummaries = [
    1,
    "com.amazonaws.bedrock",
    "ModelImportJobSummaries",
    0,
    () => ModelImportJobSummary$
  ], ModelInvocationJobSummaries = [
    1,
    "com.amazonaws.bedrock",
    "ModelInvocationJobSummaries",
    0,
    [
      () => ModelInvocationJobSummary$,
      0
    ]
  ], Offers = [
    1,
    "com.amazonaws.bedrock",
    "Offers",
    0,
    () => Offer$
  ], PromptRouterSummaries = [
    1,
    "com.amazonaws.bedrock",
    "PromptRouterSummaries",
    0,
    [
      () => PromptRouterSummary$,
      0
    ]
  ], PromptRouterTargetModels = [
    1,
    "com.amazonaws.bedrock",
    "PromptRouterTargetModels",
    0,
    () => PromptRouterTargetModel$
  ], ProvisionedModelSummaries = [
    1,
    "com.amazonaws.bedrock",
    "ProvisionedModelSummaries",
    0,
    () => ProvisionedModelSummary$
  ], RagConfigs = [
    1,
    "com.amazonaws.bedrock",
    "RagConfigs",
    0,
    [
      () => RAGConfig$,
      0
    ]
  ], RateCard = [
    1,
    "com.amazonaws.bedrock",
    "RateCard",
    0,
    () => DimensionalPriceRate$
  ], RatingScale = [
    1,
    "com.amazonaws.bedrock",
    "RatingScale",
    0,
    () => RatingScaleItem$
  ], RequestMetadataFiltersList = [
    1,
    "com.amazonaws.bedrock",
    "RequestMetadataFiltersList",
    0,
    [
      () => RequestMetadataBaseFilters$,
      0
    ]
  ], RetrievalFilterList = [
    1,
    "com.amazonaws.bedrock",
    "RetrievalFilterList",
    0,
    [
      () => RetrievalFilter$,
      0
    ]
  ], TagList = [
    1,
    "com.amazonaws.bedrock",
    "TagList",
    0,
    () => Tag$
  ], ValidationMetrics = [
    1,
    "com.amazonaws.bedrock",
    "ValidationMetrics",
    0,
    () => ValidatorMetric$
  ], Validators = [
    1,
    "com.amazonaws.bedrock",
    "Validators",
    0,
    () => Validator$
  ], AutomatedReasoningPolicyRuleReportMap = [
    2,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyRuleReportMap",
    0,
    [
      0,
      0
    ],
    [
      () => AutomatedReasoningPolicyRuleReport$,
      0
    ]
  ], AutomatedReasoningPolicyVariableReportMap = [
    2,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyVariableReportMap",
    0,
    [
      () => AutomatedReasoningPolicyDefinitionVariableName,
      0
    ],
    [
      () => AutomatedReasoningPolicyVariableReport$,
      0
    ]
  ], RequestMetadataMap = [
    2,
    "com.amazonaws.bedrock",
    "RequestMetadataMap",
    8,
    0,
    0
  ], AutomatedEvaluationCustomMetricSource$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedEvaluationCustomMetricSource",
    0,
    ["customMetricDefinition"],
    [[() => CustomMetricDefinition$, 0]]
  ], AutomatedReasoningCheckFinding$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningCheckFinding",
    0,
    ["valid", "invalid", "satisfiable", "impossible", "translationAmbiguous", "tooComplex", "noTranslations"],
    [[() => AutomatedReasoningCheckValidFinding$, 0], [() => AutomatedReasoningCheckInvalidFinding$, 0], [() => AutomatedReasoningCheckSatisfiableFinding$, 0], [() => AutomatedReasoningCheckImpossibleFinding$, 0], [() => AutomatedReasoningCheckTranslationAmbiguousFinding$, 0], () => AutomatedReasoningCheckTooComplexFinding$, () => AutomatedReasoningCheckNoTranslationsFinding$]
  ], AutomatedReasoningPolicyAnnotatedContent$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotatedContent",
    0,
    ["line"],
    [[() => AutomatedReasoningPolicyAnnotatedLine$, 0]]
  ], AutomatedReasoningPolicyAnnotation$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyAnnotation",
    0,
    ["addType", "updateType", "deleteType", "addVariable", "updateVariable", "deleteVariable", "addRule", "updateRule", "deleteRule", "addRuleFromNaturalLanguage", "updateFromRulesFeedback", "updateFromScenarioFeedback", "ingestContent"],
    [[() => AutomatedReasoningPolicyAddTypeAnnotation$, 0], [() => AutomatedReasoningPolicyUpdateTypeAnnotation$, 0], [() => AutomatedReasoningPolicyDeleteTypeAnnotation$, 0], [() => AutomatedReasoningPolicyAddVariableAnnotation$, 0], [() => AutomatedReasoningPolicyUpdateVariableAnnotation$, 0], [() => AutomatedReasoningPolicyDeleteVariableAnnotation$, 0], [() => AutomatedReasoningPolicyAddRuleAnnotation$, 0], [() => AutomatedReasoningPolicyUpdateRuleAnnotation$, 0], () => AutomatedReasoningPolicyDeleteRuleAnnotation$, [() => AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation$, 0], [() => AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation$, 0], [() => AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation$, 0], [() => AutomatedReasoningPolicyIngestContentAnnotation$, 0]]
  ], AutomatedReasoningPolicyBuildResultAssets$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildResultAssets",
    0,
    ["policyDefinition", "qualityReport", "buildLog", "generatedTestCases", "policyScenarios", "assetManifest", "document", "fidelityReport"],
    [[() => AutomatedReasoningPolicyDefinition$, 0], [() => AutomatedReasoningPolicyDefinitionQualityReport$, 0], [() => AutomatedReasoningPolicyBuildLog$, 0], [() => AutomatedReasoningPolicyGeneratedTestCases$, 0], [() => AutomatedReasoningPolicyScenarios$, 0], [() => AutomatedReasoningPolicyBuildResultAssetManifest$, 0], [() => AutomatedReasoningPolicySourceDocument$, 0], [() => AutomatedReasoningPolicyFidelityReport$, 0]]
  ], AutomatedReasoningPolicyBuildStepContext$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyBuildStepContext",
    0,
    ["planning", "mutation"],
    [() => AutomatedReasoningPolicyPlanning$, [() => AutomatedReasoningPolicyMutation$, 0]]
  ], AutomatedReasoningPolicyDefinitionElement$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyDefinitionElement",
    0,
    ["policyDefinitionVariable", "policyDefinitionType", "policyDefinitionRule"],
    [[() => AutomatedReasoningPolicyDefinitionVariable$, 0], [() => AutomatedReasoningPolicyDefinitionType$, 0], [() => AutomatedReasoningPolicyDefinitionRule$, 0]]
  ], AutomatedReasoningPolicyGenerateFidelityReportContent$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyGenerateFidelityReportContent",
    0,
    ["documents"],
    [[() => AutomatedReasoningPolicyGenerateFidelityReportDocumentList, 0]]
  ], AutomatedReasoningPolicyMutation$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyMutation",
    0,
    ["addType", "updateType", "deleteType", "addVariable", "updateVariable", "deleteVariable", "addRule", "updateRule", "deleteRule"],
    [[() => AutomatedReasoningPolicyAddTypeMutation$, 0], [() => AutomatedReasoningPolicyUpdateTypeMutation$, 0], [() => AutomatedReasoningPolicyDeleteTypeMutation$, 0], [() => AutomatedReasoningPolicyAddVariableMutation$, 0], [() => AutomatedReasoningPolicyUpdateVariableMutation$, 0], [() => AutomatedReasoningPolicyDeleteVariableMutation$, 0], [() => AutomatedReasoningPolicyAddRuleMutation$, 0], [() => AutomatedReasoningPolicyUpdateRuleMutation$, 0], () => AutomatedReasoningPolicyDeleteRuleMutation$]
  ], AutomatedReasoningPolicyTypeValueAnnotation$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyTypeValueAnnotation",
    0,
    ["addTypeValue", "updateTypeValue", "deleteTypeValue"],
    [[() => AutomatedReasoningPolicyAddTypeValue$, 0], [() => AutomatedReasoningPolicyUpdateTypeValue$, 0], () => AutomatedReasoningPolicyDeleteTypeValue$]
  ], AutomatedReasoningPolicyWorkflowTypeContent$ = [
    4,
    "com.amazonaws.bedrock",
    "AutomatedReasoningPolicyWorkflowTypeContent",
    0,
    ["documents", "policyRepairAssets", "generateFidelityReportContent"],
    [[() => AutomatedReasoningPolicyBuildWorkflowDocumentList, 0], [() => AutomatedReasoningPolicyBuildWorkflowRepairContent$, 0], [() => AutomatedReasoningPolicyGenerateFidelityReportContent$, 0]]
  ], CustomizationConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "CustomizationConfig",
    0,
    ["distillationConfig", "rftConfig"],
    [() => DistillationConfig$, () => RFTConfig$]
  ], EndpointConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EndpointConfig",
    0,
    ["sageMaker"],
    [() => SageMakerEndpoint$]
  ], EvaluationConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluationConfig",
    0,
    ["automated", "human"],
    [[() => AutomatedEvaluationConfig$, 0], [() => HumanEvaluationConfig$, 0]]
  ], EvaluationDatasetLocation$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluationDatasetLocation",
    0,
    ["s3Uri"],
    [0]
  ], EvaluationInferenceConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluationInferenceConfig",
    0,
    ["models", "ragConfigs"],
    [[() => EvaluationModelConfigs, 0], [() => RagConfigs, 0]]
  ], EvaluationModelConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluationModelConfig",
    0,
    ["bedrockModel", "precomputedInferenceSource"],
    [[() => EvaluationBedrockModel$, 0], () => EvaluationPrecomputedInferenceSource$]
  ], EvaluationPrecomputedRagSourceConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluationPrecomputedRagSourceConfig",
    0,
    ["retrieveSourceConfig", "retrieveAndGenerateSourceConfig"],
    [() => EvaluationPrecomputedRetrieveSourceConfig$, () => EvaluationPrecomputedRetrieveAndGenerateSourceConfig$]
  ], EvaluatorModelConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "EvaluatorModelConfig",
    0,
    ["bedrockEvaluatorModels"],
    [() => BedrockEvaluatorModels]
  ], GraderConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "GraderConfig",
    0,
    ["lambdaGrader"],
    [() => LambdaGraderConfig$]
  ], InferenceProfileModelSource$ = [
    4,
    "com.amazonaws.bedrock",
    "InferenceProfileModelSource",
    0,
    ["copyFrom"],
    [0]
  ], InvocationLogSource$ = [
    4,
    "com.amazonaws.bedrock",
    "InvocationLogSource",
    0,
    ["s3Uri"],
    [0]
  ], KnowledgeBaseConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "KnowledgeBaseConfig",
    0,
    ["retrieveConfig", "retrieveAndGenerateConfig"],
    [[() => RetrieveConfig$, 0], [() => RetrieveAndGenerateConfiguration$, 0]]
  ], ModelDataSource$ = [
    4,
    "com.amazonaws.bedrock",
    "ModelDataSource",
    0,
    ["s3DataSource"],
    [() => S3DataSource$]
  ], ModelInvocationJobInputDataConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "ModelInvocationJobInputDataConfig",
    0,
    ["s3InputDataConfig"],
    [() => ModelInvocationJobS3InputDataConfig$]
  ], ModelInvocationJobOutputDataConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "ModelInvocationJobOutputDataConfig",
    0,
    ["s3OutputDataConfig"],
    [() => ModelInvocationJobS3OutputDataConfig$]
  ], RAGConfig$ = [
    4,
    "com.amazonaws.bedrock",
    "RAGConfig",
    0,
    ["knowledgeBaseConfig", "precomputedRagSourceConfig"],
    [[() => KnowledgeBaseConfig$, 0], () => EvaluationPrecomputedRagSourceConfig$]
  ], RatingScaleItemValue$ = [
    4,
    "com.amazonaws.bedrock",
    "RatingScaleItemValue",
    0,
    ["stringValue", "floatValue"],
    [0, 1]
  ], RequestMetadataFilters$ = [
    4,
    "com.amazonaws.bedrock",
    "RequestMetadataFilters",
    0,
    ["equals", "notEquals", "andAll", "orAll"],
    [[() => RequestMetadataMap, 0], [() => RequestMetadataMap, 0], [() => RequestMetadataFiltersList, 0], [() => RequestMetadataFiltersList, 0]]
  ], RerankingMetadataSelectiveModeConfiguration$ = [
    4,
    "com.amazonaws.bedrock",
    "RerankingMetadataSelectiveModeConfiguration",
    0,
    ["fieldsToInclude", "fieldsToExclude"],
    [[() => FieldsForReranking, 0], [() => FieldsForReranking, 0]]
  ], RetrievalFilter$ = [
    4,
    "com.amazonaws.bedrock",
    "RetrievalFilter",
    8,
    ["equals", "notEquals", "greaterThan", "greaterThanOrEquals", "lessThan", "lessThanOrEquals", "in", "notIn", "startsWith", "listContains", "stringContains", "andAll", "orAll"],
    [() => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, () => FilterAttribute$, [() => RetrievalFilterList, 0], [() => RetrievalFilterList, 0]]
  ], BatchDeleteEvaluationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "BatchDeleteEvaluationJob",
    { ["http"]: ["POST", "/evaluation-jobs/batch-delete", 202] },
    () => BatchDeleteEvaluationJobRequest$,
    () => BatchDeleteEvaluationJobResponse$
  ], CancelAutomatedReasoningPolicyBuildWorkflow$ = [
    9,
    "com.amazonaws.bedrock",
    "CancelAutomatedReasoningPolicyBuildWorkflow",
    { ["http"]: ["POST", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/cancel", 202] },
    () => CancelAutomatedReasoningPolicyBuildWorkflowRequest$,
    () => CancelAutomatedReasoningPolicyBuildWorkflowResponse$
  ], CreateAutomatedReasoningPolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicy",
    { ["http"]: ["POST", "/automated-reasoning-policies", 200] },
    () => CreateAutomatedReasoningPolicyRequest$,
    () => CreateAutomatedReasoningPolicyResponse$
  ], CreateAutomatedReasoningPolicyTestCase$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyTestCase",
    { ["http"]: ["POST", "/automated-reasoning-policies/{policyArn}/test-cases", 200] },
    () => CreateAutomatedReasoningPolicyTestCaseRequest$,
    () => CreateAutomatedReasoningPolicyTestCaseResponse$
  ], CreateAutomatedReasoningPolicyVersion$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateAutomatedReasoningPolicyVersion",
    { ["http"]: ["POST", "/automated-reasoning-policies/{policyArn}/versions", 200] },
    () => CreateAutomatedReasoningPolicyVersionRequest$,
    () => CreateAutomatedReasoningPolicyVersionResponse$
  ], CreateCustomModel$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateCustomModel",
    { ["http"]: ["POST", "/custom-models/create-custom-model", 202] },
    () => CreateCustomModelRequest$,
    () => CreateCustomModelResponse$
  ], CreateCustomModelDeployment$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateCustomModelDeployment",
    { ["http"]: ["POST", "/model-customization/custom-model-deployments", 202] },
    () => CreateCustomModelDeploymentRequest$,
    () => CreateCustomModelDeploymentResponse$
  ], CreateEvaluationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateEvaluationJob",
    { ["http"]: ["POST", "/evaluation-jobs", 202] },
    () => CreateEvaluationJobRequest$,
    () => CreateEvaluationJobResponse$
  ], CreateFoundationModelAgreement$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateFoundationModelAgreement",
    { ["http"]: ["POST", "/create-foundation-model-agreement", 202] },
    () => CreateFoundationModelAgreementRequest$,
    () => CreateFoundationModelAgreementResponse$
  ], CreateGuardrail$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateGuardrail",
    { ["http"]: ["POST", "/guardrails", 202] },
    () => CreateGuardrailRequest$,
    () => CreateGuardrailResponse$
  ], CreateGuardrailVersion$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateGuardrailVersion",
    { ["http"]: ["POST", "/guardrails/{guardrailIdentifier}", 202] },
    () => CreateGuardrailVersionRequest$,
    () => CreateGuardrailVersionResponse$
  ], CreateInferenceProfile$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateInferenceProfile",
    { ["http"]: ["POST", "/inference-profiles", 201] },
    () => CreateInferenceProfileRequest$,
    () => CreateInferenceProfileResponse$
  ], CreateMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateMarketplaceModelEndpoint",
    { ["http"]: ["POST", "/marketplace-model/endpoints", 200] },
    () => CreateMarketplaceModelEndpointRequest$,
    () => CreateMarketplaceModelEndpointResponse$
  ], CreateModelCopyJob$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateModelCopyJob",
    { ["http"]: ["POST", "/model-copy-jobs", 201] },
    () => CreateModelCopyJobRequest$,
    () => CreateModelCopyJobResponse$
  ], CreateModelCustomizationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateModelCustomizationJob",
    { ["http"]: ["POST", "/model-customization-jobs", 201] },
    () => CreateModelCustomizationJobRequest$,
    () => CreateModelCustomizationJobResponse$
  ], CreateModelImportJob$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateModelImportJob",
    { ["http"]: ["POST", "/model-import-jobs", 201] },
    () => CreateModelImportJobRequest$,
    () => CreateModelImportJobResponse$
  ], CreateModelInvocationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateModelInvocationJob",
    { ["http"]: ["POST", "/model-invocation-job", 200] },
    () => CreateModelInvocationJobRequest$,
    () => CreateModelInvocationJobResponse$
  ], CreatePromptRouter$ = [
    9,
    "com.amazonaws.bedrock",
    "CreatePromptRouter",
    { ["http"]: ["POST", "/prompt-routers", 200] },
    () => CreatePromptRouterRequest$,
    () => CreatePromptRouterResponse$
  ], CreateProvisionedModelThroughput$ = [
    9,
    "com.amazonaws.bedrock",
    "CreateProvisionedModelThroughput",
    { ["http"]: ["POST", "/provisioned-model-throughput", 201] },
    () => CreateProvisionedModelThroughputRequest$,
    () => CreateProvisionedModelThroughputResponse$
  ], DeleteAutomatedReasoningPolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicy",
    { ["http"]: ["DELETE", "/automated-reasoning-policies/{policyArn}", 202] },
    () => DeleteAutomatedReasoningPolicyRequest$,
    () => DeleteAutomatedReasoningPolicyResponse$
  ], DeleteAutomatedReasoningPolicyBuildWorkflow$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyBuildWorkflow",
    { ["http"]: ["DELETE", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}", 202] },
    () => DeleteAutomatedReasoningPolicyBuildWorkflowRequest$,
    () => DeleteAutomatedReasoningPolicyBuildWorkflowResponse$
  ], DeleteAutomatedReasoningPolicyTestCase$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteAutomatedReasoningPolicyTestCase",
    { ["http"]: ["DELETE", "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}", 202] },
    () => DeleteAutomatedReasoningPolicyTestCaseRequest$,
    () => DeleteAutomatedReasoningPolicyTestCaseResponse$
  ], DeleteCustomModel$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteCustomModel",
    { ["http"]: ["DELETE", "/custom-models/{modelIdentifier}", 200] },
    () => DeleteCustomModelRequest$,
    () => DeleteCustomModelResponse$
  ], DeleteCustomModelDeployment$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteCustomModelDeployment",
    { ["http"]: ["DELETE", "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}", 200] },
    () => DeleteCustomModelDeploymentRequest$,
    () => DeleteCustomModelDeploymentResponse$
  ], DeleteEnforcedGuardrailConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteEnforcedGuardrailConfiguration",
    { ["http"]: ["DELETE", "/enforcedGuardrailsConfiguration/{configId}", 200] },
    () => DeleteEnforcedGuardrailConfigurationRequest$,
    () => DeleteEnforcedGuardrailConfigurationResponse$
  ], DeleteFoundationModelAgreement$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteFoundationModelAgreement",
    { ["http"]: ["POST", "/delete-foundation-model-agreement", 202] },
    () => DeleteFoundationModelAgreementRequest$,
    () => DeleteFoundationModelAgreementResponse$
  ], DeleteGuardrail$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteGuardrail",
    { ["http"]: ["DELETE", "/guardrails/{guardrailIdentifier}", 202] },
    () => DeleteGuardrailRequest$,
    () => DeleteGuardrailResponse$
  ], DeleteImportedModel$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteImportedModel",
    { ["http"]: ["DELETE", "/imported-models/{modelIdentifier}", 200] },
    () => DeleteImportedModelRequest$,
    () => DeleteImportedModelResponse$
  ], DeleteInferenceProfile$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteInferenceProfile",
    { ["http"]: ["DELETE", "/inference-profiles/{inferenceProfileIdentifier}", 200] },
    () => DeleteInferenceProfileRequest$,
    () => DeleteInferenceProfileResponse$
  ], DeleteMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteMarketplaceModelEndpoint",
    { ["http"]: ["DELETE", "/marketplace-model/endpoints/{endpointArn}", 200] },
    () => DeleteMarketplaceModelEndpointRequest$,
    () => DeleteMarketplaceModelEndpointResponse$
  ], DeleteModelInvocationLoggingConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteModelInvocationLoggingConfiguration",
    { ["http"]: ["DELETE", "/logging/modelinvocations", 200] },
    () => DeleteModelInvocationLoggingConfigurationRequest$,
    () => DeleteModelInvocationLoggingConfigurationResponse$
  ], DeletePromptRouter$ = [
    9,
    "com.amazonaws.bedrock",
    "DeletePromptRouter",
    { ["http"]: ["DELETE", "/prompt-routers/{promptRouterArn}", 200] },
    () => DeletePromptRouterRequest$,
    () => DeletePromptRouterResponse$
  ], DeleteProvisionedModelThroughput$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteProvisionedModelThroughput",
    { ["http"]: ["DELETE", "/provisioned-model-throughput/{provisionedModelId}", 200] },
    () => DeleteProvisionedModelThroughputRequest$,
    () => DeleteProvisionedModelThroughputResponse$
  ], DeleteResourcePolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "DeleteResourcePolicy",
    { ["http"]: ["DELETE", "/resource-policy/{resourceArn}", 200] },
    () => DeleteResourcePolicyRequest$,
    () => DeleteResourcePolicyResponse$
  ], DeregisterMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "DeregisterMarketplaceModelEndpoint",
    { ["http"]: ["DELETE", "/marketplace-model/endpoints/{endpointArn}/registration", 200] },
    () => DeregisterMarketplaceModelEndpointRequest$,
    () => DeregisterMarketplaceModelEndpointResponse$
  ], ExportAutomatedReasoningPolicyVersion$ = [
    9,
    "com.amazonaws.bedrock",
    "ExportAutomatedReasoningPolicyVersion",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/export", 200] },
    () => ExportAutomatedReasoningPolicyVersionRequest$,
    () => ExportAutomatedReasoningPolicyVersionResponse$
  ], GetAutomatedReasoningPolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicy",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}", 200] },
    () => GetAutomatedReasoningPolicyRequest$,
    () => GetAutomatedReasoningPolicyResponse$
  ], GetAutomatedReasoningPolicyAnnotations$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyAnnotations",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations", 200] },
    () => GetAutomatedReasoningPolicyAnnotationsRequest$,
    () => GetAutomatedReasoningPolicyAnnotationsResponse$
  ], GetAutomatedReasoningPolicyBuildWorkflow$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflow",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}", 200] },
    () => GetAutomatedReasoningPolicyBuildWorkflowRequest$,
    () => GetAutomatedReasoningPolicyBuildWorkflowResponse$
  ], GetAutomatedReasoningPolicyBuildWorkflowResultAssets$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyBuildWorkflowResultAssets",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/result-assets", 200] },
    () => GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest$,
    () => GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse$
  ], GetAutomatedReasoningPolicyNextScenario$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyNextScenario",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/scenarios", 200] },
    () => GetAutomatedReasoningPolicyNextScenarioRequest$,
    () => GetAutomatedReasoningPolicyNextScenarioResponse$
  ], GetAutomatedReasoningPolicyTestCase$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestCase",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}", 200] },
    () => GetAutomatedReasoningPolicyTestCaseRequest$,
    () => GetAutomatedReasoningPolicyTestCaseResponse$
  ], GetAutomatedReasoningPolicyTestResult$ = [
    9,
    "com.amazonaws.bedrock",
    "GetAutomatedReasoningPolicyTestResult",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-cases/{testCaseId}/test-results", 200] },
    () => GetAutomatedReasoningPolicyTestResultRequest$,
    () => GetAutomatedReasoningPolicyTestResultResponse$
  ], GetCustomModel$ = [
    9,
    "com.amazonaws.bedrock",
    "GetCustomModel",
    { ["http"]: ["GET", "/custom-models/{modelIdentifier}", 200] },
    () => GetCustomModelRequest$,
    () => GetCustomModelResponse$
  ], GetCustomModelDeployment$ = [
    9,
    "com.amazonaws.bedrock",
    "GetCustomModelDeployment",
    { ["http"]: ["GET", "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}", 200] },
    () => GetCustomModelDeploymentRequest$,
    () => GetCustomModelDeploymentResponse$
  ], GetEvaluationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "GetEvaluationJob",
    { ["http"]: ["GET", "/evaluation-jobs/{jobIdentifier}", 200] },
    () => GetEvaluationJobRequest$,
    () => GetEvaluationJobResponse$
  ], GetFoundationModel$ = [
    9,
    "com.amazonaws.bedrock",
    "GetFoundationModel",
    { ["http"]: ["GET", "/foundation-models/{modelIdentifier}", 200] },
    () => GetFoundationModelRequest$,
    () => GetFoundationModelResponse$
  ], GetFoundationModelAvailability$ = [
    9,
    "com.amazonaws.bedrock",
    "GetFoundationModelAvailability",
    { ["http"]: ["GET", "/foundation-model-availability/{modelId}", 200] },
    () => GetFoundationModelAvailabilityRequest$,
    () => GetFoundationModelAvailabilityResponse$
  ], GetGuardrail$ = [
    9,
    "com.amazonaws.bedrock",
    "GetGuardrail",
    { ["http"]: ["GET", "/guardrails/{guardrailIdentifier}", 200] },
    () => GetGuardrailRequest$,
    () => GetGuardrailResponse$
  ], GetImportedModel$ = [
    9,
    "com.amazonaws.bedrock",
    "GetImportedModel",
    { ["http"]: ["GET", "/imported-models/{modelIdentifier}", 200] },
    () => GetImportedModelRequest$,
    () => GetImportedModelResponse$
  ], GetInferenceProfile$ = [
    9,
    "com.amazonaws.bedrock",
    "GetInferenceProfile",
    { ["http"]: ["GET", "/inference-profiles/{inferenceProfileIdentifier}", 200] },
    () => GetInferenceProfileRequest$,
    () => GetInferenceProfileResponse$
  ], GetMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "GetMarketplaceModelEndpoint",
    { ["http"]: ["GET", "/marketplace-model/endpoints/{endpointArn}", 200] },
    () => GetMarketplaceModelEndpointRequest$,
    () => GetMarketplaceModelEndpointResponse$
  ], GetModelCopyJob$ = [
    9,
    "com.amazonaws.bedrock",
    "GetModelCopyJob",
    { ["http"]: ["GET", "/model-copy-jobs/{jobArn}", 200] },
    () => GetModelCopyJobRequest$,
    () => GetModelCopyJobResponse$
  ], GetModelCustomizationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "GetModelCustomizationJob",
    { ["http"]: ["GET", "/model-customization-jobs/{jobIdentifier}", 200] },
    () => GetModelCustomizationJobRequest$,
    () => GetModelCustomizationJobResponse$
  ], GetModelImportJob$ = [
    9,
    "com.amazonaws.bedrock",
    "GetModelImportJob",
    { ["http"]: ["GET", "/model-import-jobs/{jobIdentifier}", 200] },
    () => GetModelImportJobRequest$,
    () => GetModelImportJobResponse$
  ], GetModelInvocationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "GetModelInvocationJob",
    { ["http"]: ["GET", "/model-invocation-job/{jobIdentifier}", 200] },
    () => GetModelInvocationJobRequest$,
    () => GetModelInvocationJobResponse$
  ], GetModelInvocationLoggingConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "GetModelInvocationLoggingConfiguration",
    { ["http"]: ["GET", "/logging/modelinvocations", 200] },
    () => GetModelInvocationLoggingConfigurationRequest$,
    () => GetModelInvocationLoggingConfigurationResponse$
  ], GetPromptRouter$ = [
    9,
    "com.amazonaws.bedrock",
    "GetPromptRouter",
    { ["http"]: ["GET", "/prompt-routers/{promptRouterArn}", 200] },
    () => GetPromptRouterRequest$,
    () => GetPromptRouterResponse$
  ], GetProvisionedModelThroughput$ = [
    9,
    "com.amazonaws.bedrock",
    "GetProvisionedModelThroughput",
    { ["http"]: ["GET", "/provisioned-model-throughput/{provisionedModelId}", 200] },
    () => GetProvisionedModelThroughputRequest$,
    () => GetProvisionedModelThroughputResponse$
  ], GetResourcePolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "GetResourcePolicy",
    { ["http"]: ["GET", "/resource-policy/{resourceArn}", 200] },
    () => GetResourcePolicyRequest$,
    () => GetResourcePolicyResponse$
  ], GetUseCaseForModelAccess$ = [
    9,
    "com.amazonaws.bedrock",
    "GetUseCaseForModelAccess",
    { ["http"]: ["GET", "/use-case-for-model-access", 200] },
    () => GetUseCaseForModelAccessRequest$,
    () => GetUseCaseForModelAccessResponse$
  ], ListAutomatedReasoningPolicies$ = [
    9,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicies",
    { ["http"]: ["GET", "/automated-reasoning-policies", 200] },
    () => ListAutomatedReasoningPoliciesRequest$,
    () => ListAutomatedReasoningPoliciesResponse$
  ], ListAutomatedReasoningPolicyBuildWorkflows$ = [
    9,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyBuildWorkflows",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows", 200] },
    () => ListAutomatedReasoningPolicyBuildWorkflowsRequest$,
    () => ListAutomatedReasoningPolicyBuildWorkflowsResponse$
  ], ListAutomatedReasoningPolicyTestCases$ = [
    9,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestCases",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/test-cases", 200] },
    () => ListAutomatedReasoningPolicyTestCasesRequest$,
    () => ListAutomatedReasoningPolicyTestCasesResponse$
  ], ListAutomatedReasoningPolicyTestResults$ = [
    9,
    "com.amazonaws.bedrock",
    "ListAutomatedReasoningPolicyTestResults",
    { ["http"]: ["GET", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-results", 200] },
    () => ListAutomatedReasoningPolicyTestResultsRequest$,
    () => ListAutomatedReasoningPolicyTestResultsResponse$
  ], ListCustomModelDeployments$ = [
    9,
    "com.amazonaws.bedrock",
    "ListCustomModelDeployments",
    { ["http"]: ["GET", "/model-customization/custom-model-deployments", 200] },
    () => ListCustomModelDeploymentsRequest$,
    () => ListCustomModelDeploymentsResponse$
  ], ListCustomModels$ = [
    9,
    "com.amazonaws.bedrock",
    "ListCustomModels",
    { ["http"]: ["GET", "/custom-models", 200] },
    () => ListCustomModelsRequest$,
    () => ListCustomModelsResponse$
  ], ListEnforcedGuardrailsConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "ListEnforcedGuardrailsConfiguration",
    { ["http"]: ["GET", "/enforcedGuardrailsConfiguration", 200] },
    () => ListEnforcedGuardrailsConfigurationRequest$,
    () => ListEnforcedGuardrailsConfigurationResponse$
  ], ListEvaluationJobs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListEvaluationJobs",
    { ["http"]: ["GET", "/evaluation-jobs", 200] },
    () => ListEvaluationJobsRequest$,
    () => ListEvaluationJobsResponse$
  ], ListFoundationModelAgreementOffers$ = [
    9,
    "com.amazonaws.bedrock",
    "ListFoundationModelAgreementOffers",
    { ["http"]: ["GET", "/list-foundation-model-agreement-offers/{modelId}", 200] },
    () => ListFoundationModelAgreementOffersRequest$,
    () => ListFoundationModelAgreementOffersResponse$
  ], ListFoundationModels$ = [
    9,
    "com.amazonaws.bedrock",
    "ListFoundationModels",
    { ["http"]: ["GET", "/foundation-models", 200] },
    () => ListFoundationModelsRequest$,
    () => ListFoundationModelsResponse$
  ], ListGuardrails$ = [
    9,
    "com.amazonaws.bedrock",
    "ListGuardrails",
    { ["http"]: ["GET", "/guardrails", 200] },
    () => ListGuardrailsRequest$,
    () => ListGuardrailsResponse$
  ], ListImportedModels$ = [
    9,
    "com.amazonaws.bedrock",
    "ListImportedModels",
    { ["http"]: ["GET", "/imported-models", 200] },
    () => ListImportedModelsRequest$,
    () => ListImportedModelsResponse$
  ], ListInferenceProfiles$ = [
    9,
    "com.amazonaws.bedrock",
    "ListInferenceProfiles",
    { ["http"]: ["GET", "/inference-profiles", 200] },
    () => ListInferenceProfilesRequest$,
    () => ListInferenceProfilesResponse$
  ], ListMarketplaceModelEndpoints$ = [
    9,
    "com.amazonaws.bedrock",
    "ListMarketplaceModelEndpoints",
    { ["http"]: ["GET", "/marketplace-model/endpoints", 200] },
    () => ListMarketplaceModelEndpointsRequest$,
    () => ListMarketplaceModelEndpointsResponse$
  ], ListModelCopyJobs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListModelCopyJobs",
    { ["http"]: ["GET", "/model-copy-jobs", 200] },
    () => ListModelCopyJobsRequest$,
    () => ListModelCopyJobsResponse$
  ], ListModelCustomizationJobs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListModelCustomizationJobs",
    { ["http"]: ["GET", "/model-customization-jobs", 200] },
    () => ListModelCustomizationJobsRequest$,
    () => ListModelCustomizationJobsResponse$
  ], ListModelImportJobs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListModelImportJobs",
    { ["http"]: ["GET", "/model-import-jobs", 200] },
    () => ListModelImportJobsRequest$,
    () => ListModelImportJobsResponse$
  ], ListModelInvocationJobs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListModelInvocationJobs",
    { ["http"]: ["GET", "/model-invocation-jobs", 200] },
    () => ListModelInvocationJobsRequest$,
    () => ListModelInvocationJobsResponse$
  ], ListPromptRouters$ = [
    9,
    "com.amazonaws.bedrock",
    "ListPromptRouters",
    { ["http"]: ["GET", "/prompt-routers", 200] },
    () => ListPromptRoutersRequest$,
    () => ListPromptRoutersResponse$
  ], ListProvisionedModelThroughputs$ = [
    9,
    "com.amazonaws.bedrock",
    "ListProvisionedModelThroughputs",
    { ["http"]: ["GET", "/provisioned-model-throughputs", 200] },
    () => ListProvisionedModelThroughputsRequest$,
    () => ListProvisionedModelThroughputsResponse$
  ], ListTagsForResource$ = [
    9,
    "com.amazonaws.bedrock",
    "ListTagsForResource",
    { ["http"]: ["POST", "/listTagsForResource", 200] },
    () => ListTagsForResourceRequest$,
    () => ListTagsForResourceResponse$
  ], PutEnforcedGuardrailConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "PutEnforcedGuardrailConfiguration",
    { ["http"]: ["PUT", "/enforcedGuardrailsConfiguration", 200] },
    () => PutEnforcedGuardrailConfigurationRequest$,
    () => PutEnforcedGuardrailConfigurationResponse$
  ], PutModelInvocationLoggingConfiguration$ = [
    9,
    "com.amazonaws.bedrock",
    "PutModelInvocationLoggingConfiguration",
    { ["http"]: ["PUT", "/logging/modelinvocations", 200] },
    () => PutModelInvocationLoggingConfigurationRequest$,
    () => PutModelInvocationLoggingConfigurationResponse$
  ], PutResourcePolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "PutResourcePolicy",
    { ["http"]: ["POST", "/resource-policy", 201] },
    () => PutResourcePolicyRequest$,
    () => PutResourcePolicyResponse$
  ], PutUseCaseForModelAccess$ = [
    9,
    "com.amazonaws.bedrock",
    "PutUseCaseForModelAccess",
    { ["http"]: ["POST", "/use-case-for-model-access", 201] },
    () => PutUseCaseForModelAccessRequest$,
    () => PutUseCaseForModelAccessResponse$
  ], RegisterMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "RegisterMarketplaceModelEndpoint",
    { ["http"]: ["POST", "/marketplace-model/endpoints/{endpointIdentifier}/registration", 200] },
    () => RegisterMarketplaceModelEndpointRequest$,
    () => RegisterMarketplaceModelEndpointResponse$
  ], StartAutomatedReasoningPolicyBuildWorkflow$ = [
    9,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyBuildWorkflow",
    { ["http"]: ["POST", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowType}/start", 200] },
    () => StartAutomatedReasoningPolicyBuildWorkflowRequest$,
    () => StartAutomatedReasoningPolicyBuildWorkflowResponse$
  ], StartAutomatedReasoningPolicyTestWorkflow$ = [
    9,
    "com.amazonaws.bedrock",
    "StartAutomatedReasoningPolicyTestWorkflow",
    { ["http"]: ["POST", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-workflows", 200] },
    () => StartAutomatedReasoningPolicyTestWorkflowRequest$,
    () => StartAutomatedReasoningPolicyTestWorkflowResponse$
  ], StopEvaluationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "StopEvaluationJob",
    { ["http"]: ["POST", "/evaluation-job/{jobIdentifier}/stop", 200] },
    () => StopEvaluationJobRequest$,
    () => StopEvaluationJobResponse$
  ], StopModelCustomizationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "StopModelCustomizationJob",
    { ["http"]: ["POST", "/model-customization-jobs/{jobIdentifier}/stop", 200] },
    () => StopModelCustomizationJobRequest$,
    () => StopModelCustomizationJobResponse$
  ], StopModelInvocationJob$ = [
    9,
    "com.amazonaws.bedrock",
    "StopModelInvocationJob",
    { ["http"]: ["POST", "/model-invocation-job/{jobIdentifier}/stop", 200] },
    () => StopModelInvocationJobRequest$,
    () => StopModelInvocationJobResponse$
  ], TagResource$ = [
    9,
    "com.amazonaws.bedrock",
    "TagResource",
    { ["http"]: ["POST", "/tagResource", 200] },
    () => TagResourceRequest$,
    () => TagResourceResponse$
  ], UntagResource$ = [
    9,
    "com.amazonaws.bedrock",
    "UntagResource",
    { ["http"]: ["POST", "/untagResource", 200] },
    () => UntagResourceRequest$,
    () => UntagResourceResponse$
  ], UpdateAutomatedReasoningPolicy$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicy",
    { ["http"]: ["PATCH", "/automated-reasoning-policies/{policyArn}", 200] },
    () => UpdateAutomatedReasoningPolicyRequest$,
    () => UpdateAutomatedReasoningPolicyResponse$
  ], UpdateAutomatedReasoningPolicyAnnotations$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyAnnotations",
    { ["http"]: ["PATCH", "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations", 200] },
    () => UpdateAutomatedReasoningPolicyAnnotationsRequest$,
    () => UpdateAutomatedReasoningPolicyAnnotationsResponse$
  ], UpdateAutomatedReasoningPolicyTestCase$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateAutomatedReasoningPolicyTestCase",
    { ["http"]: ["PATCH", "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}", 200] },
    () => UpdateAutomatedReasoningPolicyTestCaseRequest$,
    () => UpdateAutomatedReasoningPolicyTestCaseResponse$
  ], UpdateCustomModelDeployment$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateCustomModelDeployment",
    { ["http"]: ["PATCH", "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}", 202] },
    () => UpdateCustomModelDeploymentRequest$,
    () => UpdateCustomModelDeploymentResponse$
  ], UpdateGuardrail$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateGuardrail",
    { ["http"]: ["PUT", "/guardrails/{guardrailIdentifier}", 202] },
    () => UpdateGuardrailRequest$,
    () => UpdateGuardrailResponse$
  ], UpdateMarketplaceModelEndpoint$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateMarketplaceModelEndpoint",
    { ["http"]: ["PATCH", "/marketplace-model/endpoints/{endpointArn}", 200] },
    () => UpdateMarketplaceModelEndpointRequest$,
    () => UpdateMarketplaceModelEndpointResponse$
  ], UpdateProvisionedModelThroughput$ = [
    9,
    "com.amazonaws.bedrock",
    "UpdateProvisionedModelThroughput",
    { ["http"]: ["PATCH", "/provisioned-model-throughput/{provisionedModelId}", 200] },
    () => UpdateProvisionedModelThroughputRequest$,
    () => UpdateProvisionedModelThroughputResponse$
  ];
});

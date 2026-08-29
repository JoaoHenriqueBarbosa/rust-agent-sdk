// var: init_enums2
var init_enums2 = __esm(() => {
  AsyncInvokeStatus = {
    COMPLETED: "Completed",
    FAILED: "Failed",
    IN_PROGRESS: "InProgress"
  }, SortAsyncInvocationBy = {
    SUBMISSION_TIME: "SubmissionTime"
  }, SortOrder2 = {
    ASCENDING: "Ascending",
    DESCENDING: "Descending"
  }, GuardrailImageFormat = {
    JPEG: "jpeg",
    PNG: "png"
  }, GuardrailContentQualifier = {
    GROUNDING_SOURCE: "grounding_source",
    GUARD_CONTENT: "guard_content",
    QUERY: "query"
  }, GuardrailOutputScope = {
    FULL: "FULL",
    INTERVENTIONS: "INTERVENTIONS"
  }, GuardrailContentSource = {
    INPUT: "INPUT",
    OUTPUT: "OUTPUT"
  }, GuardrailAction = {
    GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
    NONE: "NONE"
  }, GuardrailOrigin = {
    ACCOUNT_ENFORCED: "ACCOUNT_ENFORCED",
    ORGANIZATION_ENFORCED: "ORGANIZATION_ENFORCED",
    REQUEST: "REQUEST"
  }, GuardrailOwnership = {
    CROSS_ACCOUNT: "CROSS_ACCOUNT",
    SELF: "SELF"
  }, GuardrailAutomatedReasoningLogicWarningType = {
    ALWAYS_FALSE: "ALWAYS_FALSE",
    ALWAYS_TRUE: "ALWAYS_TRUE"
  }, GuardrailContentPolicyAction = {
    BLOCKED: "BLOCKED",
    NONE: "NONE"
  }, GuardrailContentFilterConfidence = {
    HIGH: "HIGH",
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    NONE: "NONE"
  }, GuardrailContentFilterStrength = {
    HIGH: "HIGH",
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    NONE: "NONE"
  }, GuardrailContentFilterType2 = {
    HATE: "HATE",
    INSULTS: "INSULTS",
    MISCONDUCT: "MISCONDUCT",
    PROMPT_ATTACK: "PROMPT_ATTACK",
    SEXUAL: "SEXUAL",
    VIOLENCE: "VIOLENCE"
  }, GuardrailContextualGroundingPolicyAction = {
    BLOCKED: "BLOCKED",
    NONE: "NONE"
  }, GuardrailContextualGroundingFilterType2 = {
    GROUNDING: "GROUNDING",
    RELEVANCE: "RELEVANCE"
  }, GuardrailSensitiveInformationPolicyAction = {
    ANONYMIZED: "ANONYMIZED",
    BLOCKED: "BLOCKED",
    NONE: "NONE"
  }, GuardrailPiiEntityType2 = {
    ADDRESS: "ADDRESS",
    AGE: "AGE",
    AWS_ACCESS_KEY: "AWS_ACCESS_KEY",
    AWS_SECRET_KEY: "AWS_SECRET_KEY",
    CA_HEALTH_NUMBER: "CA_HEALTH_NUMBER",
    CA_SOCIAL_INSURANCE_NUMBER: "CA_SOCIAL_INSURANCE_NUMBER",
    CREDIT_DEBIT_CARD_CVV: "CREDIT_DEBIT_CARD_CVV",
    CREDIT_DEBIT_CARD_EXPIRY: "CREDIT_DEBIT_CARD_EXPIRY",
    CREDIT_DEBIT_CARD_NUMBER: "CREDIT_DEBIT_CARD_NUMBER",
    DRIVER_ID: "DRIVER_ID",
    EMAIL: "EMAIL",
    INTERNATIONAL_BANK_ACCOUNT_NUMBER: "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
    IP_ADDRESS: "IP_ADDRESS",
    LICENSE_PLATE: "LICENSE_PLATE",
    MAC_ADDRESS: "MAC_ADDRESS",
    NAME: "NAME",
    PASSWORD: "PASSWORD",
    PHONE: "PHONE",
    PIN: "PIN",
    SWIFT_CODE: "SWIFT_CODE",
    UK_NATIONAL_HEALTH_SERVICE_NUMBER: "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
    UK_NATIONAL_INSURANCE_NUMBER: "UK_NATIONAL_INSURANCE_NUMBER",
    UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER: "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
    URL: "URL",
    USERNAME: "USERNAME",
    US_BANK_ACCOUNT_NUMBER: "US_BANK_ACCOUNT_NUMBER",
    US_BANK_ROUTING_NUMBER: "US_BANK_ROUTING_NUMBER",
    US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER: "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
    US_PASSPORT_NUMBER: "US_PASSPORT_NUMBER",
    US_SOCIAL_SECURITY_NUMBER: "US_SOCIAL_SECURITY_NUMBER",
    VEHICLE_IDENTIFICATION_NUMBER: "VEHICLE_IDENTIFICATION_NUMBER"
  }, GuardrailTopicPolicyAction = {
    BLOCKED: "BLOCKED",
    NONE: "NONE"
  }, GuardrailTopicType2 = {
    DENY: "DENY"
  }, GuardrailWordPolicyAction = {
    BLOCKED: "BLOCKED",
    NONE: "NONE"
  }, GuardrailManagedWordType = {
    PROFANITY: "PROFANITY"
  }, GuardrailTrace = {
    DISABLED: "disabled",
    ENABLED: "enabled",
    ENABLED_FULL: "enabled_full"
  }, AudioFormat = {
    AAC: "aac",
    FLAC: "flac",
    M4A: "m4a",
    MKA: "mka",
    MKV: "mkv",
    MP3: "mp3",
    MP4: "mp4",
    MPEG: "mpeg",
    MPGA: "mpga",
    OGG: "ogg",
    OPUS: "opus",
    PCM: "pcm",
    WAV: "wav",
    WEBM: "webm",
    X_AAC: "x-aac"
  }, CacheTTL = {
    FIVE_MINUTES: "5m",
    ONE_HOUR: "1h"
  }, CachePointType = {
    DEFAULT: "default"
  }, DocumentFormat = {
    CSV: "csv",
    DOC: "doc",
    DOCX: "docx",
    HTML: "html",
    MD: "md",
    PDF: "pdf",
    TXT: "txt",
    XLS: "xls",
    XLSX: "xlsx"
  }, GuardrailConverseImageFormat = {
    JPEG: "jpeg",
    PNG: "png"
  }, GuardrailConverseContentQualifier = {
    GROUNDING_SOURCE: "grounding_source",
    GUARD_CONTENT: "guard_content",
    QUERY: "query"
  }, ImageFormat = {
    GIF: "gif",
    JPEG: "jpeg",
    PNG: "png",
    WEBP: "webp"
  }, VideoFormat = {
    FLV: "flv",
    MKV: "mkv",
    MOV: "mov",
    MP4: "mp4",
    MPEG: "mpeg",
    MPG: "mpg",
    THREE_GP: "three_gp",
    WEBM: "webm",
    WMV: "wmv"
  }, ToolResultStatus = {
    ERROR: "error",
    SUCCESS: "success"
  }, ToolUseType = {
    SERVER_TOOL_USE: "server_tool_use"
  }, ConversationRole = {
    ASSISTANT: "assistant",
    USER: "user"
  }, OutputFormatType = {
    JSON_SCHEMA: "json_schema"
  }, PerformanceConfigLatency2 = {
    OPTIMIZED: "optimized",
    STANDARD: "standard"
  }, ServiceTierType = {
    DEFAULT: "default",
    FLEX: "flex",
    PRIORITY: "priority",
    RESERVED: "reserved"
  }, StopReason = {
    CONTENT_FILTERED: "content_filtered",
    END_TURN: "end_turn",
    GUARDRAIL_INTERVENED: "guardrail_intervened",
    MALFORMED_MODEL_OUTPUT: "malformed_model_output",
    MALFORMED_TOOL_USE: "malformed_tool_use",
    MAX_TOKENS: "max_tokens",
    MODEL_CONTEXT_WINDOW_EXCEEDED: "model_context_window_exceeded",
    STOP_SEQUENCE: "stop_sequence",
    TOOL_USE: "tool_use"
  }, GuardrailStreamProcessingMode = {
    ASYNC: "async",
    SYNC: "sync"
  }, Trace = {
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
    ENABLED_FULL: "ENABLED_FULL"
  };
});

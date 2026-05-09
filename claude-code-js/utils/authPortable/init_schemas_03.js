// var: init_schemas_03
var init_schemas_03 = __esm(() => {
  init_errors6();
  init_STSServiceException();
  import_schema9 = __toESM(require_schema(), 1), _s_registry3 = import_schema9.TypeRegistry.for("smithy.ts.sdk.synthetic.com.amazonaws.sts"), STSServiceException$ = [-3, "smithy.ts.sdk.synthetic.com.amazonaws.sts", "STSServiceException", 0, [], []];
  _s_registry3.registerError(STSServiceException$, STSServiceException);
  n0_registry3 = import_schema9.TypeRegistry.for("com.amazonaws.sts"), ExpiredTokenException$ = [
    -3,
    "com.amazonaws.sts",
    "ExpiredTokenException",
    { ["awsQueryError"]: ["ExpiredTokenException", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(ExpiredTokenException$, ExpiredTokenException);
  ExpiredTradeInTokenException$ = [
    -3,
    "com.amazonaws.sts",
    "ExpiredTradeInTokenException",
    { ["awsQueryError"]: ["ExpiredTradeInTokenException", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(ExpiredTradeInTokenException$, ExpiredTradeInTokenException);
  IDPCommunicationErrorException$ = [
    -3,
    "com.amazonaws.sts",
    "IDPCommunicationErrorException",
    { ["awsQueryError"]: ["IDPCommunicationError", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(IDPCommunicationErrorException$, IDPCommunicationErrorException);
  IDPRejectedClaimException$ = [
    -3,
    "com.amazonaws.sts",
    "IDPRejectedClaimException",
    { ["awsQueryError"]: ["IDPRejectedClaim", 403], ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(IDPRejectedClaimException$, IDPRejectedClaimException);
  InvalidAuthorizationMessageException$ = [
    -3,
    "com.amazonaws.sts",
    "InvalidAuthorizationMessageException",
    { ["awsQueryError"]: ["InvalidAuthorizationMessageException", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(InvalidAuthorizationMessageException$, InvalidAuthorizationMessageException);
  InvalidIdentityTokenException$ = [
    -3,
    "com.amazonaws.sts",
    "InvalidIdentityTokenException",
    { ["awsQueryError"]: ["InvalidIdentityToken", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(InvalidIdentityTokenException$, InvalidIdentityTokenException);
  JWTPayloadSizeExceededException$ = [
    -3,
    "com.amazonaws.sts",
    "JWTPayloadSizeExceededException",
    { ["awsQueryError"]: ["JWTPayloadSizeExceededException", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(JWTPayloadSizeExceededException$, JWTPayloadSizeExceededException);
  MalformedPolicyDocumentException$ = [
    -3,
    "com.amazonaws.sts",
    "MalformedPolicyDocumentException",
    { ["awsQueryError"]: ["MalformedPolicyDocument", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(MalformedPolicyDocumentException$, MalformedPolicyDocumentException);
  OutboundWebIdentityFederationDisabledException$ = [
    -3,
    "com.amazonaws.sts",
    "OutboundWebIdentityFederationDisabledException",
    { ["awsQueryError"]: ["OutboundWebIdentityFederationDisabledException", 403], ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(OutboundWebIdentityFederationDisabledException$, OutboundWebIdentityFederationDisabledException);
  PackedPolicyTooLargeException$ = [
    -3,
    "com.amazonaws.sts",
    "PackedPolicyTooLargeException",
    { ["awsQueryError"]: ["PackedPolicyTooLarge", 400], ["error"]: "client", ["httpError"]: 400 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(PackedPolicyTooLargeException$, PackedPolicyTooLargeException);
  RegionDisabledException$ = [
    -3,
    "com.amazonaws.sts",
    "RegionDisabledException",
    { ["awsQueryError"]: ["RegionDisabledException", 403], ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(RegionDisabledException$, RegionDisabledException);
  SessionDurationEscalationException$ = [
    -3,
    "com.amazonaws.sts",
    "SessionDurationEscalationException",
    { ["awsQueryError"]: ["SessionDurationEscalationException", 403], ["error"]: "client", ["httpError"]: 403 },
    ["message"],
    [0]
  ];
  n0_registry3.registerError(SessionDurationEscalationException$, SessionDurationEscalationException);
  errorTypeRegistries3 = [
    _s_registry3,
    n0_registry3
  ], accessKeySecretType = [0, "com.amazonaws.sts", "accessKeySecretType", 8, 0], clientTokenType = [0, "com.amazonaws.sts", "clientTokenType", 8, 0], SAMLAssertionType = [0, "com.amazonaws.sts", "SAMLAssertionType", 8, 0], tradeInTokenType = [0, "com.amazonaws.sts", "tradeInTokenType", 8, 0], webIdentityTokenType = [0, "com.amazonaws.sts", "webIdentityTokenType", 8, 0], AssumedRoleUser$ = [
    3,
    "com.amazonaws.sts",
    "AssumedRoleUser",
    0,
    ["AssumedRoleId", "Arn"],
    [0, 0],
    2
  ], AssumeRoleRequest$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleRequest",
    0,
    ["RoleArn", "RoleSessionName", "PolicyArns", "Policy", "DurationSeconds", "Tags", "TransitiveTagKeys", "ExternalId", "SerialNumber", "TokenCode", "SourceIdentity", "ProvidedContexts"],
    [0, 0, () => policyDescriptorListType, 0, 1, () => tagListType, 64, 0, 0, 0, 0, () => ProvidedContextsListType],
    2
  ], AssumeRoleResponse$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleResponse",
    0,
    ["Credentials", "AssumedRoleUser", "PackedPolicySize", "SourceIdentity"],
    [[() => Credentials$, 0], () => AssumedRoleUser$, 1, 0]
  ], AssumeRoleWithSAMLRequest$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleWithSAMLRequest",
    0,
    ["RoleArn", "PrincipalArn", "SAMLAssertion", "PolicyArns", "Policy", "DurationSeconds"],
    [0, 0, [() => SAMLAssertionType, 0], () => policyDescriptorListType, 0, 1],
    3
  ], AssumeRoleWithSAMLResponse$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleWithSAMLResponse",
    0,
    ["Credentials", "AssumedRoleUser", "PackedPolicySize", "Subject", "SubjectType", "Issuer", "Audience", "NameQualifier", "SourceIdentity"],
    [[() => Credentials$, 0], () => AssumedRoleUser$, 1, 0, 0, 0, 0, 0, 0]
  ], AssumeRoleWithWebIdentityRequest$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleWithWebIdentityRequest",
    0,
    ["RoleArn", "RoleSessionName", "WebIdentityToken", "ProviderId", "PolicyArns", "Policy", "DurationSeconds"],
    [0, 0, [() => clientTokenType, 0], 0, () => policyDescriptorListType, 0, 1],
    3
  ], AssumeRoleWithWebIdentityResponse$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRoleWithWebIdentityResponse",
    0,
    ["Credentials", "SubjectFromWebIdentityToken", "AssumedRoleUser", "PackedPolicySize", "Provider", "Audience", "SourceIdentity"],
    [[() => Credentials$, 0], 0, () => AssumedRoleUser$, 1, 0, 0, 0]
  ], AssumeRootRequest$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRootRequest",
    0,
    ["TargetPrincipal", "TaskPolicyArn", "DurationSeconds"],
    [0, () => PolicyDescriptorType$, 1],
    2
  ], AssumeRootResponse$ = [
    3,
    "com.amazonaws.sts",
    "AssumeRootResponse",
    0,
    ["Credentials", "SourceIdentity"],
    [[() => Credentials$, 0], 0]
  ], Credentials$ = [
    3,
    "com.amazonaws.sts",
    "Credentials",
    0,
    ["AccessKeyId", "SecretAccessKey", "SessionToken", "Expiration"],
    [0, [() => accessKeySecretType, 0], 0, 4],
    4
  ], DecodeAuthorizationMessageRequest$ = [
    3,
    "com.amazonaws.sts",
    "DecodeAuthorizationMessageRequest",
    0,
    ["EncodedMessage"],
    [0],
    1
  ], DecodeAuthorizationMessageResponse$ = [
    3,
    "com.amazonaws.sts",
    "DecodeAuthorizationMessageResponse",
    0,
    ["DecodedMessage"],
    [0]
  ], FederatedUser$ = [
    3,
    "com.amazonaws.sts",
    "FederatedUser",
    0,
    ["FederatedUserId", "Arn"],
    [0, 0],
    2
  ], GetAccessKeyInfoRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetAccessKeyInfoRequest",
    0,
    ["AccessKeyId"],
    [0],
    1
  ], GetAccessKeyInfoResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetAccessKeyInfoResponse",
    0,
    ["Account"],
    [0]
  ], GetCallerIdentityRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetCallerIdentityRequest",
    0,
    [],
    []
  ], GetCallerIdentityResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetCallerIdentityResponse",
    0,
    ["UserId", "Account", "Arn"],
    [0, 0, 0]
  ], GetDelegatedAccessTokenRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetDelegatedAccessTokenRequest",
    0,
    ["TradeInToken"],
    [[() => tradeInTokenType, 0]],
    1
  ], GetDelegatedAccessTokenResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetDelegatedAccessTokenResponse",
    0,
    ["Credentials", "PackedPolicySize", "AssumedPrincipal"],
    [[() => Credentials$, 0], 1, 0]
  ], GetFederationTokenRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetFederationTokenRequest",
    0,
    ["Name", "Policy", "PolicyArns", "DurationSeconds", "Tags"],
    [0, 0, () => policyDescriptorListType, 1, () => tagListType],
    1
  ], GetFederationTokenResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetFederationTokenResponse",
    0,
    ["Credentials", "FederatedUser", "PackedPolicySize"],
    [[() => Credentials$, 0], () => FederatedUser$, 1]
  ], GetSessionTokenRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetSessionTokenRequest",
    0,
    ["DurationSeconds", "SerialNumber", "TokenCode"],
    [1, 0, 0]
  ], GetSessionTokenResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetSessionTokenResponse",
    0,
    ["Credentials"],
    [[() => Credentials$, 0]]
  ], GetWebIdentityTokenRequest$ = [
    3,
    "com.amazonaws.sts",
    "GetWebIdentityTokenRequest",
    0,
    ["Audience", "SigningAlgorithm", "DurationSeconds", "Tags"],
    [64, 0, 1, () => tagListType],
    2
  ], GetWebIdentityTokenResponse$ = [
    3,
    "com.amazonaws.sts",
    "GetWebIdentityTokenResponse",
    0,
    ["WebIdentityToken", "Expiration"],
    [[() => webIdentityTokenType, 0], 4]
  ], PolicyDescriptorType$ = [
    3,
    "com.amazonaws.sts",
    "PolicyDescriptorType",
    0,
    ["arn"],
    [0]
  ], ProvidedContext$ = [
    3,
    "com.amazonaws.sts",
    "ProvidedContext",
    0,
    ["ProviderArn", "ContextAssertion"],
    [0, 0]
  ], Tag$3 = [
    3,
    "com.amazonaws.sts",
    "Tag",
    0,
    ["Key", "Value"],
    [0, 0],
    2
  ], policyDescriptorListType = [
    1,
    "com.amazonaws.sts",
    "policyDescriptorListType",
    0,
    () => PolicyDescriptorType$
  ], ProvidedContextsListType = [
    1,
    "com.amazonaws.sts",
    "ProvidedContextsListType",
    0,
    () => ProvidedContext$
  ], tagListType = [
    1,
    "com.amazonaws.sts",
    "tagListType",
    0,
    () => Tag$3
  ], AssumeRole$ = [
    9,
    "com.amazonaws.sts",
    "AssumeRole",
    0,
    () => AssumeRoleRequest$,
    () => AssumeRoleResponse$
  ], AssumeRoleWithSAML$ = [
    9,
    "com.amazonaws.sts",
    "AssumeRoleWithSAML",
    0,
    () => AssumeRoleWithSAMLRequest$,
    () => AssumeRoleWithSAMLResponse$
  ], AssumeRoleWithWebIdentity$ = [
    9,
    "com.amazonaws.sts",
    "AssumeRoleWithWebIdentity",
    0,
    () => AssumeRoleWithWebIdentityRequest$,
    () => AssumeRoleWithWebIdentityResponse$
  ], AssumeRoot$ = [
    9,
    "com.amazonaws.sts",
    "AssumeRoot",
    0,
    () => AssumeRootRequest$,
    () => AssumeRootResponse$
  ], DecodeAuthorizationMessage$ = [
    9,
    "com.amazonaws.sts",
    "DecodeAuthorizationMessage",
    0,
    () => DecodeAuthorizationMessageRequest$,
    () => DecodeAuthorizationMessageResponse$
  ], GetAccessKeyInfo$ = [
    9,
    "com.amazonaws.sts",
    "GetAccessKeyInfo",
    0,
    () => GetAccessKeyInfoRequest$,
    () => GetAccessKeyInfoResponse$
  ], GetCallerIdentity$ = [
    9,
    "com.amazonaws.sts",
    "GetCallerIdentity",
    0,
    () => GetCallerIdentityRequest$,
    () => GetCallerIdentityResponse$
  ], GetDelegatedAccessToken$ = [
    9,
    "com.amazonaws.sts",
    "GetDelegatedAccessToken",
    0,
    () => GetDelegatedAccessTokenRequest$,
    () => GetDelegatedAccessTokenResponse$
  ], GetFederationToken$ = [
    9,
    "com.amazonaws.sts",
    "GetFederationToken",
    0,
    () => GetFederationTokenRequest$,
    () => GetFederationTokenResponse$
  ], GetSessionToken$ = [
    9,
    "com.amazonaws.sts",
    "GetSessionToken",
    0,
    () => GetSessionTokenRequest$,
    () => GetSessionTokenResponse$
  ], GetWebIdentityToken$ = [
    9,
    "com.amazonaws.sts",
    "GetWebIdentityToken",
    0,
    () => GetWebIdentityTokenRequest$,
    () => GetWebIdentityTokenResponse$
  ];
});

// var: init_auth15
var init_auth15 = __esm(() => {
  init_v4();
  SafeUrlSchema = url().superRefine((val, ctx) => {
    if (!URL.canParse(val))
      return ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "URL must be parseable",
        fatal: !0
      }), NEVER;
  }).refine((url3) => {
    let u5 = new URL(url3);
    return u5.protocol !== "javascript:" && u5.protocol !== "data:" && u5.protocol !== "vbscript:";
  }, { message: "URL cannot use javascript:, data:, or vbscript: scheme" }), OAuthProtectedResourceMetadataSchema = looseObject({
    resource: string2().url(),
    authorization_servers: array(SafeUrlSchema).optional(),
    jwks_uri: string2().url().optional(),
    scopes_supported: array(string2()).optional(),
    bearer_methods_supported: array(string2()).optional(),
    resource_signing_alg_values_supported: array(string2()).optional(),
    resource_name: string2().optional(),
    resource_documentation: string2().optional(),
    resource_policy_uri: string2().url().optional(),
    resource_tos_uri: string2().url().optional(),
    tls_client_certificate_bound_access_tokens: boolean2().optional(),
    authorization_details_types_supported: array(string2()).optional(),
    dpop_signing_alg_values_supported: array(string2()).optional(),
    dpop_bound_access_tokens_required: boolean2().optional()
  }), OAuthMetadataSchema = looseObject({
    issuer: string2(),
    authorization_endpoint: SafeUrlSchema,
    token_endpoint: SafeUrlSchema,
    registration_endpoint: SafeUrlSchema.optional(),
    scopes_supported: array(string2()).optional(),
    response_types_supported: array(string2()),
    response_modes_supported: array(string2()).optional(),
    grant_types_supported: array(string2()).optional(),
    token_endpoint_auth_methods_supported: array(string2()).optional(),
    token_endpoint_auth_signing_alg_values_supported: array(string2()).optional(),
    service_documentation: SafeUrlSchema.optional(),
    revocation_endpoint: SafeUrlSchema.optional(),
    revocation_endpoint_auth_methods_supported: array(string2()).optional(),
    revocation_endpoint_auth_signing_alg_values_supported: array(string2()).optional(),
    introspection_endpoint: string2().optional(),
    introspection_endpoint_auth_methods_supported: array(string2()).optional(),
    introspection_endpoint_auth_signing_alg_values_supported: array(string2()).optional(),
    code_challenge_methods_supported: array(string2()).optional(),
    client_id_metadata_document_supported: boolean2().optional()
  }), OpenIdProviderMetadataSchema = looseObject({
    issuer: string2(),
    authorization_endpoint: SafeUrlSchema,
    token_endpoint: SafeUrlSchema,
    userinfo_endpoint: SafeUrlSchema.optional(),
    jwks_uri: SafeUrlSchema,
    registration_endpoint: SafeUrlSchema.optional(),
    scopes_supported: array(string2()).optional(),
    response_types_supported: array(string2()),
    response_modes_supported: array(string2()).optional(),
    grant_types_supported: array(string2()).optional(),
    acr_values_supported: array(string2()).optional(),
    subject_types_supported: array(string2()),
    id_token_signing_alg_values_supported: array(string2()),
    id_token_encryption_alg_values_supported: array(string2()).optional(),
    id_token_encryption_enc_values_supported: array(string2()).optional(),
    userinfo_signing_alg_values_supported: array(string2()).optional(),
    userinfo_encryption_alg_values_supported: array(string2()).optional(),
    userinfo_encryption_enc_values_supported: array(string2()).optional(),
    request_object_signing_alg_values_supported: array(string2()).optional(),
    request_object_encryption_alg_values_supported: array(string2()).optional(),
    request_object_encryption_enc_values_supported: array(string2()).optional(),
    token_endpoint_auth_methods_supported: array(string2()).optional(),
    token_endpoint_auth_signing_alg_values_supported: array(string2()).optional(),
    display_values_supported: array(string2()).optional(),
    claim_types_supported: array(string2()).optional(),
    claims_supported: array(string2()).optional(),
    service_documentation: string2().optional(),
    claims_locales_supported: array(string2()).optional(),
    ui_locales_supported: array(string2()).optional(),
    claims_parameter_supported: boolean2().optional(),
    request_parameter_supported: boolean2().optional(),
    request_uri_parameter_supported: boolean2().optional(),
    require_request_uri_registration: boolean2().optional(),
    op_policy_uri: SafeUrlSchema.optional(),
    op_tos_uri: SafeUrlSchema.optional(),
    client_id_metadata_document_supported: boolean2().optional()
  }), OpenIdProviderDiscoveryMetadataSchema = object({
    ...OpenIdProviderMetadataSchema.shape,
    ...OAuthMetadataSchema.pick({
      code_challenge_methods_supported: !0
    }).shape
  }), OAuthTokensSchema = object({
    access_token: string2(),
    id_token: string2().optional(),
    token_type: string2(),
    expires_in: exports_coerce.number().optional(),
    scope: string2().optional(),
    refresh_token: string2().optional()
  }).strip(), OAuthErrorResponseSchema = object({
    error: string2(),
    error_description: string2().optional(),
    error_uri: string2().optional()
  }), OptionalSafeUrlSchema = SafeUrlSchema.optional().or(literal("").transform(() => {
    return;
  })), OAuthClientMetadataSchema = object({
    redirect_uris: array(SafeUrlSchema),
    token_endpoint_auth_method: string2().optional(),
    grant_types: array(string2()).optional(),
    response_types: array(string2()).optional(),
    client_name: string2().optional(),
    client_uri: SafeUrlSchema.optional(),
    logo_uri: OptionalSafeUrlSchema,
    scope: string2().optional(),
    contacts: array(string2()).optional(),
    tos_uri: OptionalSafeUrlSchema,
    policy_uri: string2().optional(),
    jwks_uri: SafeUrlSchema.optional(),
    jwks: any().optional(),
    software_id: string2().optional(),
    software_version: string2().optional(),
    software_statement: string2().optional()
  }).strip(), OAuthClientInformationSchema = object({
    client_id: string2(),
    client_secret: string2().optional(),
    client_id_issued_at: number2().optional(),
    client_secret_expires_at: number2().optional()
  }).strip(), OAuthClientInformationFullSchema = OAuthClientMetadataSchema.merge(OAuthClientInformationSchema), OAuthClientRegistrationErrorSchema = object({
    error: string2(),
    error_description: string2().optional()
  }).strip(), OAuthTokenRevocationRequestSchema = object({
    token: string2(),
    token_type_hint: string2().optional()
  }).strip();
});

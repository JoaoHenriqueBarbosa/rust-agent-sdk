// var: MANIFEST_VERSION7
var MANIFEST_VERSION7 = "0.3", LOCALE_PLACEHOLDER_REGEX3, BCP47_REGEX3, ICON_SIZE_REGEX3, McpServerConfigSchema8, McpbManifestAuthorSchema7, McpbManifestRepositorySchema7, McpbManifestPlatformOverrideSchema7, McpbManifestMcpConfigSchema7, McpbManifestServerSchema7, McpbManifestCompatibilitySchema7, McpbManifestToolSchema7, McpbManifestPromptSchema7, McpbUserConfigurationOptionSchema7, McpbManifestLocalizationSchema3, McpbManifestIconSchema3, McpbManifestSchema7;
var init_0_32 = __esm(() => {
  init_zod();
  LOCALE_PLACEHOLDER_REGEX3 = /\$\{locale\}/i, BCP47_REGEX3 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/, ICON_SIZE_REGEX3 = /^\d+x\d+$/, McpServerConfigSchema8 = objectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema7 = objectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema7 = objectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema7 = McpServerConfigSchema8.partial(), McpbManifestMcpConfigSchema7 = McpServerConfigSchema8.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema7).optional()
  }), McpbManifestServerSchema7 = objectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema7
  }), McpbManifestCompatibilitySchema7 = objectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: objectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }).passthrough(), McpbManifestToolSchema7 = objectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema7 = objectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema7 = objectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestLocalizationSchema3 = objectType({
    resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX3, 'resources must include a "${locale}" placeholder'),
    default_locale: stringType().regex(BCP47_REGEX3, "default_locale must be a valid BCP 47 locale identifier")
  }).passthrough(), McpbManifestIconSchema3 = objectType({
    src: stringType(),
    size: stringType().regex(ICON_SIZE_REGEX3, 'size must be in the format "WIDTHxHEIGHT" (e.g., "16x16")'),
    theme: stringType().min(1).optional()
  }).passthrough(), McpbManifestSchema7 = objectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION7).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION7).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema7,
    repository: McpbManifestRepositorySchema7.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    icons: arrayType(McpbManifestIconSchema3).optional(),
    screenshots: arrayType(stringType()).optional(),
    localization: McpbManifestLocalizationSchema3.optional(),
    server: McpbManifestServerSchema7,
    tools: arrayType(McpbManifestToolSchema7).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema7).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema7.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema7).optional(),
    _meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
  }).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

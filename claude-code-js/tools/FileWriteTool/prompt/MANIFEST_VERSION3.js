// var: MANIFEST_VERSION3
var MANIFEST_VERSION3 = "0.3", LOCALE_PLACEHOLDER_REGEX, BCP47_REGEX, ICON_SIZE_REGEX, McpServerConfigSchema4, McpbManifestAuthorSchema3, McpbManifestRepositorySchema3, McpbManifestPlatformOverrideSchema3, McpbManifestMcpConfigSchema3, McpbManifestServerSchema3, McpbManifestCompatibilitySchema3, McpbManifestToolSchema3, McpbManifestPromptSchema3, McpbUserConfigurationOptionSchema3, McpbManifestLocalizationSchema, McpbManifestIconSchema, McpbManifestSchema3;
var init_0_3 = __esm(() => {
  init_zod();
  LOCALE_PLACEHOLDER_REGEX = /\$\{locale\}/i, BCP47_REGEX = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/, ICON_SIZE_REGEX = /^\d+x\d+$/, McpServerConfigSchema4 = strictObjectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema3 = strictObjectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema3 = strictObjectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema3 = McpServerConfigSchema4.partial(), McpbManifestMcpConfigSchema3 = McpServerConfigSchema4.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema3).optional()
  }), McpbManifestServerSchema3 = strictObjectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema3
  }), McpbManifestCompatibilitySchema3 = strictObjectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: strictObjectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }), McpbManifestToolSchema3 = strictObjectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema3 = strictObjectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema3 = strictObjectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestLocalizationSchema = strictObjectType({
    resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX, 'resources must include a "${locale}" placeholder'),
    default_locale: stringType().regex(BCP47_REGEX, "default_locale must be a valid BCP 47 locale identifier")
  }), McpbManifestIconSchema = strictObjectType({
    src: stringType(),
    size: stringType().regex(ICON_SIZE_REGEX, 'size must be in the format "WIDTHxHEIGHT" (e.g., "16x16")'),
    theme: stringType().min(1, "theme cannot be empty when provided").optional()
  }), McpbManifestSchema3 = strictObjectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION3).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION3).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema3,
    repository: McpbManifestRepositorySchema3.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    icons: arrayType(McpbManifestIconSchema).optional(),
    screenshots: arrayType(stringType()).optional(),
    localization: McpbManifestLocalizationSchema.optional(),
    server: McpbManifestServerSchema3,
    tools: arrayType(McpbManifestToolSchema3).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema3).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema3.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema3).optional(),
    _meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
  }).refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

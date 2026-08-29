// var: MANIFEST_VERSION4
var MANIFEST_VERSION4 = "0.4", LOCALE_PLACEHOLDER_REGEX2, BCP47_REGEX2, ICON_SIZE_REGEX2, McpServerConfigSchema5, McpbManifestAuthorSchema4, McpbManifestRepositorySchema4, McpbManifestPlatformOverrideSchema4, McpbManifestMcpConfigSchema4, McpbManifestServerSchema4, McpbManifestCompatibilitySchema4, McpbManifestToolSchema4, McpbManifestPromptSchema4, McpbUserConfigurationOptionSchema4, McpbManifestLocalizationSchema2, McpbManifestIconSchema2, McpbManifestSchema4;
var init_0_4 = __esm(() => {
  init_zod();
  LOCALE_PLACEHOLDER_REGEX2 = /\$\{locale\}/i, BCP47_REGEX2 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/, ICON_SIZE_REGEX2 = /^\d+x\d+$/, McpServerConfigSchema5 = strictObjectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema4 = strictObjectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema4 = strictObjectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema4 = McpServerConfigSchema5.partial(), McpbManifestMcpConfigSchema4 = McpServerConfigSchema5.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema4).optional()
  }), McpbManifestServerSchema4 = strictObjectType({
    type: enumType(["python", "node", "binary", "uv"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema4
  }), McpbManifestCompatibilitySchema4 = strictObjectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: strictObjectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }), McpbManifestToolSchema4 = strictObjectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema4 = strictObjectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema4 = strictObjectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestLocalizationSchema2 = strictObjectType({
    resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX2, 'resources must include a "${locale}" placeholder'),
    default_locale: stringType().regex(BCP47_REGEX2, "default_locale must be a valid BCP 47 locale identifier")
  }), McpbManifestIconSchema2 = strictObjectType({
    src: stringType(),
    size: stringType().regex(ICON_SIZE_REGEX2, 'size must be in the format "WIDTHxHEIGHT" (e.g., "16x16")'),
    theme: stringType().min(1, "theme cannot be empty when provided").optional()
  }), McpbManifestSchema4 = strictObjectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION4).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION4).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema4,
    repository: McpbManifestRepositorySchema4.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    icons: arrayType(McpbManifestIconSchema2).optional(),
    screenshots: arrayType(stringType()).optional(),
    localization: McpbManifestLocalizationSchema2.optional(),
    server: McpbManifestServerSchema4,
    tools: arrayType(McpbManifestToolSchema4).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema4).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema4.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema4).optional(),
    _meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
  }).refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

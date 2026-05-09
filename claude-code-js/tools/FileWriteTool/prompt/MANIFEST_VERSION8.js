// var: MANIFEST_VERSION8
var MANIFEST_VERSION8 = "0.4", LOCALE_PLACEHOLDER_REGEX4, BCP47_REGEX4, ICON_SIZE_REGEX4, McpServerConfigSchema9, McpbManifestAuthorSchema8, McpbManifestRepositorySchema8, McpbManifestPlatformOverrideSchema8, McpbManifestMcpConfigSchema8, McpbManifestServerSchema8, McpbManifestCompatibilitySchema8, McpbManifestToolSchema8, McpbManifestPromptSchema8, McpbUserConfigurationOptionSchema8, McpbManifestLocalizationSchema4, McpbManifestIconSchema4, McpbManifestSchema8;
var init_0_42 = __esm(() => {
  init_zod();
  LOCALE_PLACEHOLDER_REGEX4 = /\$\{locale\}/i, BCP47_REGEX4 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/, ICON_SIZE_REGEX4 = /^\d+x\d+$/, McpServerConfigSchema9 = objectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema8 = objectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema8 = objectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema8 = McpServerConfigSchema9.partial(), McpbManifestMcpConfigSchema8 = McpServerConfigSchema9.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema8).optional()
  }), McpbManifestServerSchema8 = objectType({
    type: enumType(["python", "node", "binary", "uv"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema8.optional()
  }), McpbManifestCompatibilitySchema8 = objectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: objectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }).passthrough(), McpbManifestToolSchema8 = objectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema8 = objectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema8 = objectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestLocalizationSchema4 = objectType({
    resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX4, 'resources must include a "${locale}" placeholder'),
    default_locale: stringType().regex(BCP47_REGEX4, "default_locale must be a valid BCP 47 locale identifier")
  }).passthrough(), McpbManifestIconSchema4 = objectType({
    src: stringType(),
    size: stringType().regex(ICON_SIZE_REGEX4, 'size must be in the format "WIDTHxHEIGHT" (e.g., "16x16")'),
    theme: stringType().min(1).optional()
  }).passthrough(), McpbManifestSchema8 = objectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION8).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION8).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema8,
    repository: McpbManifestRepositorySchema8.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    icons: arrayType(McpbManifestIconSchema4).optional(),
    screenshots: arrayType(stringType()).optional(),
    localization: McpbManifestLocalizationSchema4.optional(),
    server: McpbManifestServerSchema8,
    tools: arrayType(McpbManifestToolSchema8).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema8).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema8.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema8).optional(),
    _meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
  }).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

// var: MANIFEST_VERSION6
var MANIFEST_VERSION6 = "0.2", McpServerConfigSchema7, McpbManifestAuthorSchema6, McpbManifestRepositorySchema6, McpbManifestPlatformOverrideSchema6, McpbManifestMcpConfigSchema6, McpbManifestServerSchema6, McpbManifestCompatibilitySchema6, McpbManifestToolSchema6, McpbManifestPromptSchema6, McpbUserConfigurationOptionSchema6, McpbManifestSchema6;
var init_0_22 = __esm(() => {
  init_zod();
  McpServerConfigSchema7 = objectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema6 = objectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema6 = objectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema6 = McpServerConfigSchema7.partial(), McpbManifestMcpConfigSchema6 = McpServerConfigSchema7.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema6).optional()
  }), McpbManifestServerSchema6 = objectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema6
  }), McpbManifestCompatibilitySchema6 = objectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: objectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }).passthrough(), McpbManifestToolSchema6 = objectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema6 = objectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema6 = objectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestSchema6 = objectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION6).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION6).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema6,
    repository: McpbManifestRepositorySchema6.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    screenshots: arrayType(stringType()).optional(),
    server: McpbManifestServerSchema6,
    tools: arrayType(McpbManifestToolSchema6).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema6).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema6.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema6).optional()
  }).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

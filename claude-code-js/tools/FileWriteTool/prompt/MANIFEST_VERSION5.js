// var: MANIFEST_VERSION5
var MANIFEST_VERSION5 = "0.1", McpServerConfigSchema6, McpbManifestAuthorSchema5, McpbManifestRepositorySchema5, McpbManifestPlatformOverrideSchema5, McpbManifestMcpConfigSchema5, McpbManifestServerSchema5, McpbManifestCompatibilitySchema5, McpbManifestToolSchema5, McpbManifestPromptSchema5, McpbUserConfigurationOptionSchema5, McpbManifestSchema5;
var init_0_12 = __esm(() => {
  init_zod();
  McpServerConfigSchema6 = objectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema5 = objectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema5 = objectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema5 = McpServerConfigSchema6.partial(), McpbManifestMcpConfigSchema5 = McpServerConfigSchema6.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema5).optional()
  }), McpbManifestServerSchema5 = objectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema5
  }), McpbManifestCompatibilitySchema5 = objectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: objectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }).passthrough(), McpbManifestToolSchema5 = objectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema5 = objectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema5 = objectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestSchema5 = objectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION5).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION5).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema5,
    repository: McpbManifestRepositorySchema5.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    screenshots: arrayType(stringType()).optional(),
    server: McpbManifestServerSchema5,
    tools: arrayType(McpbManifestToolSchema5).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema5).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    compatibility: McpbManifestCompatibilitySchema5.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema5).optional()
  }).refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

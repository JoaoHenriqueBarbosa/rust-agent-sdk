// var: MANIFEST_VERSION
var MANIFEST_VERSION = "0.1", McpServerConfigSchema2, McpbManifestAuthorSchema, McpbManifestRepositorySchema, McpbManifestPlatformOverrideSchema, McpbManifestMcpConfigSchema, McpbManifestServerSchema, McpbManifestCompatibilitySchema, McpbManifestToolSchema, McpbManifestPromptSchema, McpbUserConfigurationOptionSchema, McpbManifestSchema;
var init_0_1 = __esm(() => {
  init_zod();
  McpServerConfigSchema2 = strictObjectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema = strictObjectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema = strictObjectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema = McpServerConfigSchema2.partial(), McpbManifestMcpConfigSchema = McpServerConfigSchema2.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema).optional()
  }), McpbManifestServerSchema = strictObjectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema
  }), McpbManifestCompatibilitySchema = strictObjectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: strictObjectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }), McpbManifestToolSchema = strictObjectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema = strictObjectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema = strictObjectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestSchema = strictObjectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema,
    repository: McpbManifestRepositorySchema.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    screenshots: arrayType(stringType()).optional(),
    server: McpbManifestServerSchema,
    tools: arrayType(McpbManifestToolSchema).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    compatibility: McpbManifestCompatibilitySchema.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema).optional()
  }).refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

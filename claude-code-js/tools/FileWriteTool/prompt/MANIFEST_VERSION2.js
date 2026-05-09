// var: MANIFEST_VERSION2
var MANIFEST_VERSION2 = "0.2", McpServerConfigSchema3, McpbManifestAuthorSchema2, McpbManifestRepositorySchema2, McpbManifestPlatformOverrideSchema2, McpbManifestMcpConfigSchema2, McpbManifestServerSchema2, McpbManifestCompatibilitySchema2, McpbManifestToolSchema2, McpbManifestPromptSchema2, McpbUserConfigurationOptionSchema2, McpbManifestSchema2;
var init_0_2 = __esm(() => {
  init_zod();
  McpServerConfigSchema3 = strictObjectType({
    command: stringType(),
    args: arrayType(stringType()).optional(),
    env: recordType(stringType(), stringType()).optional()
  }), McpbManifestAuthorSchema2 = strictObjectType({
    name: stringType(),
    email: stringType().email().optional(),
    url: stringType().url().optional()
  }), McpbManifestRepositorySchema2 = strictObjectType({
    type: stringType(),
    url: stringType().url()
  }), McpbManifestPlatformOverrideSchema2 = McpServerConfigSchema3.partial(), McpbManifestMcpConfigSchema2 = McpServerConfigSchema3.extend({
    platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema2).optional()
  }), McpbManifestServerSchema2 = strictObjectType({
    type: enumType(["python", "node", "binary"]),
    entry_point: stringType(),
    mcp_config: McpbManifestMcpConfigSchema2
  }), McpbManifestCompatibilitySchema2 = strictObjectType({
    claude_desktop: stringType().optional(),
    platforms: arrayType(enumType(["darwin", "win32", "linux"])).optional(),
    runtimes: strictObjectType({
      python: stringType().optional(),
      node: stringType().optional()
    }).optional()
  }), McpbManifestToolSchema2 = strictObjectType({
    name: stringType(),
    description: stringType().optional()
  }), McpbManifestPromptSchema2 = strictObjectType({
    name: stringType(),
    description: stringType().optional(),
    arguments: arrayType(stringType()).optional(),
    text: stringType()
  }), McpbUserConfigurationOptionSchema2 = strictObjectType({
    type: enumType(["string", "number", "boolean", "directory", "file"]),
    title: stringType(),
    description: stringType(),
    required: booleanType().optional(),
    default: unionType([stringType(), numberType(), booleanType(), arrayType(stringType())]).optional(),
    multiple: booleanType().optional(),
    sensitive: booleanType().optional(),
    min: numberType().optional(),
    max: numberType().optional()
  }), McpbManifestSchema2 = strictObjectType({
    $schema: stringType().optional(),
    dxt_version: literalType(MANIFEST_VERSION2).optional().describe("@deprecated Use manifest_version instead"),
    manifest_version: literalType(MANIFEST_VERSION2).optional(),
    name: stringType(),
    display_name: stringType().optional(),
    version: stringType(),
    description: stringType(),
    long_description: stringType().optional(),
    author: McpbManifestAuthorSchema2,
    repository: McpbManifestRepositorySchema2.optional(),
    homepage: stringType().url().optional(),
    documentation: stringType().url().optional(),
    support: stringType().url().optional(),
    icon: stringType().optional(),
    screenshots: arrayType(stringType()).optional(),
    server: McpbManifestServerSchema2,
    tools: arrayType(McpbManifestToolSchema2).optional(),
    tools_generated: booleanType().optional(),
    prompts: arrayType(McpbManifestPromptSchema2).optional(),
    prompts_generated: booleanType().optional(),
    keywords: arrayType(stringType()).optional(),
    license: stringType().optional(),
    privacy_policies: arrayType(stringType().url()).optional(),
    compatibility: McpbManifestCompatibilitySchema2.optional(),
    user_config: recordType(stringType(), McpbUserConfigurationOptionSchema2).optional()
  }).refine((data) => !!(data.dxt_version || data.manifest_version), {
    message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
  });
});

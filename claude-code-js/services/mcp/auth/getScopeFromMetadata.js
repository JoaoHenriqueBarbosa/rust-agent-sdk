// function: getScopeFromMetadata
function getScopeFromMetadata(metadata) {
  if (!metadata)
    return;
  if ("scope" in metadata && typeof metadata.scope === "string")
    return metadata.scope;
  if ("default_scope" in metadata && typeof metadata.default_scope === "string")
    return metadata.default_scope;
  if (metadata.scopes_supported && Array.isArray(metadata.scopes_supported))
    return metadata.scopes_supported.join(" ");
  return;
}

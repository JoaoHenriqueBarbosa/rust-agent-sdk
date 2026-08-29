// function: isPathMetadata
function isPathMetadata(metadata) {
  return typeof metadata === "object" && metadata !== null && "type" in metadata && (metadata.type === "directory" || metadata.type === "file");
}

// function: isAuthorityMetadataExpired
function isAuthorityMetadataExpired(metadata) {
  return metadata.expiresAt <= nowSeconds();
}

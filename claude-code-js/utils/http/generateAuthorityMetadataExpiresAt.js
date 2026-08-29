// function: generateAuthorityMetadataExpiresAt
function generateAuthorityMetadataExpiresAt() {
  return nowSeconds() + AUTHORITY_METADATA_REFRESH_TIME_SECONDS;
}

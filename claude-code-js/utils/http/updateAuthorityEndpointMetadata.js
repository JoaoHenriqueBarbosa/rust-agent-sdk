// function: updateAuthorityEndpointMetadata
function updateAuthorityEndpointMetadata(authorityMetadata, updatedValues, fromNetwork) {
  authorityMetadata.authorization_endpoint = updatedValues.authorization_endpoint, authorityMetadata.token_endpoint = updatedValues.token_endpoint, authorityMetadata.end_session_endpoint = updatedValues.end_session_endpoint, authorityMetadata.issuer = updatedValues.issuer, authorityMetadata.endpointsFromNetwork = fromNetwork, authorityMetadata.jwks_uri = updatedValues.jwks_uri;
}

// function: parseErrorResponse
async function parseErrorResponse(input) {
  let statusCode = input instanceof Response ? input.status : void 0, body = input instanceof Response ? await input.text() : input;
  try {
    let result = OAuthErrorResponseSchema.parse(JSON.parse(body)), { error: error44, error_description, error_uri } = result;
    return new (OAUTH_ERRORS[error44] || ServerError2)(error_description || "", error_uri);
  } catch (error44) {
    let errorMessage2 = `${statusCode ? `HTTP ${statusCode}: ` : ""}Invalid OAuth error response: ${error44}. Raw body: ${body}`;
    return new ServerError2(errorMessage2);
  }
}

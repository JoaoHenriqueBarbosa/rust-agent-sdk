// function: normalizeOAuthErrorBody
async function normalizeOAuthErrorBody(response7) {
  if (!response7.ok)
    return response7;
  let text2 = await response7.text(), parsed;
  try {
    parsed = jsonParse(text2);
  } catch {
    return new Response(text2, response7);
  }
  if (OAuthTokensSchema.safeParse(parsed).success)
    return new Response(text2, response7);
  let result = OAuthErrorResponseSchema.safeParse(parsed);
  if (!result.success)
    return new Response(text2, response7);
  let normalized = NONSTANDARD_INVALID_GRANT_ALIASES.has(result.data.error) ? {
    error: "invalid_grant",
    error_description: result.data.error_description ?? `Server returned non-standard error code: ${result.data.error}`
  } : result.data;
  return new Response(jsonStringify(normalized), {
    status: 400,
    statusText: "Bad Request",
    headers: response7.headers
  });
}

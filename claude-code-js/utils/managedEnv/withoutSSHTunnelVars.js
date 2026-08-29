// function: withoutSSHTunnelVars
function withoutSSHTunnelVars(env5) {
  if (!env5 || !process.env.ANTHROPIC_UNIX_SOCKET)
    return env5 || {};
  let {
    ANTHROPIC_UNIX_SOCKET: _1,
    ANTHROPIC_BASE_URL: _2,
    ANTHROPIC_API_KEY: _3,
    ANTHROPIC_AUTH_TOKEN: _4,
    CLAUDE_CODE_OAUTH_TOKEN: _5,
    ...rest
  } = env5;
  return rest;
}

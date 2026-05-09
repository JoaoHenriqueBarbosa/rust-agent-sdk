// function: resolveGitSubdirUrl
function resolveGitSubdirUrl(url3) {
  if (/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(url3))
    return isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${url3}.git` : `git@github.com:${url3}.git`;
  return validateGitUrl(url3);
}

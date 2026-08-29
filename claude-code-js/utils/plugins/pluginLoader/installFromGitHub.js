// function: installFromGitHub
async function installFromGitHub(repo, targetPath, ref, sha) {
  if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(repo))
    throw Error(`Invalid GitHub repository format: ${repo}. Expected format: owner/repo`);
  let gitUrl = isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) ? `https://github.com/${repo}.git` : `git@github.com:${repo}.git`;
  return installFromGit(gitUrl, targetPath, ref, sha);
}

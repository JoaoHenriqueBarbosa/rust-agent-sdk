// function: validateSessionRepository
async function validateSessionRepository(sessionData) {
  let currentParsed = await detectCurrentRepositoryWithHost(), currentRepo = currentParsed ? `${currentParsed.owner}/${currentParsed.name}` : null, gitSource = sessionData.session_context.sources.find((source) => source.type === "git_repository");
  if (!gitSource?.url)
    return logForDebugging(currentRepo ? "Session has no associated repository, proceeding without validation" : "Session has no repo requirement and not in git directory, proceeding"), {
      status: "no_repo_required"
    };
  let sessionParsed = parseGitRemote(gitSource.url), sessionRepo = sessionParsed ? `${sessionParsed.owner}/${sessionParsed.name}` : parseGitHubRepository(gitSource.url);
  if (!sessionRepo)
    return {
      status: "no_repo_required"
    };
  if (logForDebugging(`Session is for repository: ${sessionRepo}, current repo: ${currentRepo ?? "none"}`), !currentRepo)
    return {
      status: "not_in_repo",
      sessionRepo,
      sessionHost: sessionParsed?.host,
      currentRepo: null
    };
  let stripPort = (host) => host.replace(/:\d+$/, ""), repoMatch = currentRepo.toLowerCase() === sessionRepo.toLowerCase(), hostMatch = !currentParsed || !sessionParsed || stripPort(currentParsed.host.toLowerCase()) === stripPort(sessionParsed.host.toLowerCase());
  if (repoMatch && hostMatch)
    return {
      status: "match",
      sessionRepo,
      currentRepo
    };
  return {
    status: "mismatch",
    sessionRepo,
    currentRepo,
    sessionHost: sessionParsed?.host,
    currentHost: currentParsed?.host
  };
}

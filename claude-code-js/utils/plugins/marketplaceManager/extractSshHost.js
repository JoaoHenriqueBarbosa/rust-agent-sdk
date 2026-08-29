// function: extractSshHost
function extractSshHost(gitUrl) {
  return gitUrl.match(/^[^@]+@([^:]+):/)?.[1] ?? null;
}

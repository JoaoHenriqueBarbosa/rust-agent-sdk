// function: handleMemoryFileReadError
function handleMemoryFileReadError(error44, filePath) {
  let code = getErrnoCode(error44);
  if (code === "ENOENT" || code === "EISDIR")
    return;
  if (code === "EACCES")
    logEvent("tengu_claude_md_permission_error", {
      is_access_error: 1,
      has_home_dir: filePath.includes(getClaudeConfigHomeDir()) ? 1 : 0
    });
}

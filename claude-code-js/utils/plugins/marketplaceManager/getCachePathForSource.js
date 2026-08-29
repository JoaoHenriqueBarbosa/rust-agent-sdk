// function: getCachePathForSource
function getCachePathForSource(source) {
  return source.source === "github" ? source.repo.replace("/", "-") : source.source === "npm" ? source.package.replace("@", "").replace("/", "-") : source.source === "file" ? basename29(source.path).replace(".json", "") : source.source === "directory" ? basename29(source.path) : "temp_" + Date.now();
}

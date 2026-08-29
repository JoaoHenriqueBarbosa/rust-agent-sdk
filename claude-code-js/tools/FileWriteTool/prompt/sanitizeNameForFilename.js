// function: sanitizeNameForFilename
function sanitizeNameForFilename(name3) {
  return name3.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_.]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100);
}

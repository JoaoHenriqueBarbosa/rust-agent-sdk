// Original: src/utils/bundledMode.ts
function isRunningWithBun() {
  return process.versions.bun !== void 0;
}
function isInBundledMode() {
  return typeof Bun < "u" && Array.isArray(Bun.embeddedFiles) && Bun.embeddedFiles.length > 0;
}

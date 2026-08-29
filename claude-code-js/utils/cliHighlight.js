// Original: src/utils/cliHighlight.ts
import { extname as extname5 } from "path";
async function loadCliHighlight() {
  try {
    let cliHighlight = await import("cli-highlight");
    return loadedGetLanguage = (await Promise.resolve().then(() => (init_es2(), exports_es))).getLanguage, {
      highlight: cliHighlight.highlight,
      supportsLanguage: cliHighlight.supportsLanguage
    };
  } catch {
    return null;
  }
}
function getCliHighlightPromise() {
  return cliHighlightPromise ??= loadCliHighlight(), cliHighlightPromise;
}
async function getLanguageName(file_path) {
  await getCliHighlightPromise();
  let ext = extname5(file_path).slice(1);
  if (!ext)
    return "unknown";
  return loadedGetLanguage?.(ext)?.name ?? "unknown";
}
var cliHighlightPromise, loadedGetLanguage;
var init_cliHighlight = () => {};

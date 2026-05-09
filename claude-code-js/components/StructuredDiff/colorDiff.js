// Original: src/components/StructuredDiff/colorDiff.ts
import {
  ColorDiff,
  ColorFile,
  getSyntaxTheme as nativeGetSyntaxTheme
} from "color-diff-napi";
function getColorModuleUnavailableReason() {
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_SYNTAX_HIGHLIGHT))
    return "env";
  return null;
}
function expectColorDiff() {
  return getColorModuleUnavailableReason() === null ? ColorDiff : null;
}
function expectColorFile() {
  return getColorModuleUnavailableReason() === null ? ColorFile : null;
}
function getSyntaxTheme(themeName) {
  return getColorModuleUnavailableReason() === null ? nativeGetSyntaxTheme(themeName) : null;
}
var init_colorDiff = __esm(() => {
  init_envUtils();
});

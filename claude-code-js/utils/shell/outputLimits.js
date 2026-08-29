// Original: src/utils/shell/outputLimits.ts
function getMaxOutputLength() {
  return validateBoundedIntEnvVar("BASH_MAX_OUTPUT_LENGTH", process.env.BASH_MAX_OUTPUT_LENGTH, BASH_MAX_OUTPUT_DEFAULT, BASH_MAX_OUTPUT_UPPER_LIMIT).effective;
}
var BASH_MAX_OUTPUT_UPPER_LIMIT = 150000, BASH_MAX_OUTPUT_DEFAULT = 30000;
var init_outputLimits = __esm(() => {
  init_envValidation();
});

// var: isUpKey
var isUpKey = (key) => key.name === "up" || key.name === "k" || key.ctrl && key.name === "p", isDownKey = (key) => key.name === "down" || key.name === "j" || key.ctrl && key.name === "n", isBackspaceKey = (key) => key.name === "backspace", isNumberKey = (key) => "123456789".includes(key.name), isEnterKey = (key) => key.name === "enter" || key.name === "return";

// node_modules/@inquirer/core/dist/esm/lib/errors.mjs
var AbortPromptError, CancelPromptError, ExitPromptError, HookError, ValidationError;
var init_errors9 = __esm(() => {
  AbortPromptError = class AbortPromptError extends Error {
    name = "AbortPromptError";
    message = "Prompt was aborted";
    constructor(options) {
      super();
      this.cause = options?.cause;
    }
  };
  CancelPromptError = class CancelPromptError extends Error {
    name = "CancelPromptError";
    message = "Prompt was canceled";
  };
  ExitPromptError = class ExitPromptError extends Error {
    name = "ExitPromptError";
  };
  HookError = class HookError extends Error {
    name = "HookError";
  };
  ValidationError = class ValidationError extends Error {
    name = "ValidationError";
  };
});

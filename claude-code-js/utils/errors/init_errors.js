// var: init_errors
var init_errors = __esm(() => {
  init_sdk();
  ClaudeError = class ClaudeError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
  };
  MalformedCommandError = class MalformedCommandError extends Error {
  };
  AbortError = class AbortError extends Error {
    constructor(message) {
      super(message);
      this.name = "AbortError";
    }
  };
  ConfigParseError = class ConfigParseError extends Error {
    filePath;
    defaultConfig;
    constructor(message, filePath, defaultConfig) {
      super(message);
      this.name = "ConfigParseError", this.filePath = filePath, this.defaultConfig = defaultConfig;
    }
  };
  ShellError = class ShellError extends Error {
    stdout;
    stderr;
    code;
    interrupted;
    constructor(stdout, stderr, code, interrupted) {
      super("Shell command failed");
      this.stdout = stdout;
      this.stderr = stderr;
      this.code = code;
      this.interrupted = interrupted;
      this.name = "ShellError";
    }
  };
  TeleportOperationError = class TeleportOperationError extends Error {
    formattedMessage;
    constructor(message, formattedMessage) {
      super(message);
      this.formattedMessage = formattedMessage;
      this.name = "TeleportOperationError";
    }
  };
  TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = class TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS extends Error {
    telemetryMessage;
    constructor(message, telemetryMessage) {
      super(message);
      this.name = "TelemetrySafeError", this.telemetryMessage = telemetryMessage ?? message;
    }
  };
});

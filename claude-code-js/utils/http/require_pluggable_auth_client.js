// var: require_pluggable_auth_client
var require_pluggable_auth_client = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PluggableAuthClient = exports.ExecutableError = void 0;
  var baseexternalclient_1 = require_baseexternalclient(), executable_response_1 = require_executable_response(), pluggable_auth_handler_1 = require_pluggable_auth_handler();

  class ExecutableError extends Error {
    constructor(message, code) {
      super(`The executable failed with exit code: ${code} and error message: ${message}.`);
      this.code = code, Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  exports.ExecutableError = ExecutableError;
  var DEFAULT_EXECUTABLE_TIMEOUT_MILLIS = 30000, MINIMUM_EXECUTABLE_TIMEOUT_MILLIS = 5000, MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS = 120000, GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES = "GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES", MAXIMUM_EXECUTABLE_VERSION = 1;

  class PluggableAuthClient extends baseexternalclient_1.BaseExternalAccountClient {
    constructor(options, additionalOptions) {
      super(options, additionalOptions);
      if (!options.credential_source.executable)
        throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (this.command = options.credential_source.executable.command, !this.command)
        throw Error('No valid Pluggable Auth "credential_source" provided.');
      if (options.credential_source.executable.timeout_millis === void 0)
        this.timeoutMillis = DEFAULT_EXECUTABLE_TIMEOUT_MILLIS;
      else if (this.timeoutMillis = options.credential_source.executable.timeout_millis, this.timeoutMillis < MINIMUM_EXECUTABLE_TIMEOUT_MILLIS || this.timeoutMillis > MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS)
        throw Error(`Timeout must be between ${MINIMUM_EXECUTABLE_TIMEOUT_MILLIS} and ${MAXIMUM_EXECUTABLE_TIMEOUT_MILLIS} milliseconds.`);
      this.outputFile = options.credential_source.executable.output_file, this.handler = new pluggable_auth_handler_1.PluggableAuthHandler({
        command: this.command,
        timeoutMillis: this.timeoutMillis,
        outputFile: this.outputFile
      }), this.credentialSourceType = "executable";
    }
    async retrieveSubjectToken() {
      if (process.env[GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES] !== "1")
        throw Error("Pluggable Auth executables need to be explicitly allowed to run by setting the GOOGLE_EXTERNAL_ACCOUNT_ALLOW_EXECUTABLES environment Variable to 1.");
      let executableResponse = void 0;
      if (this.outputFile)
        executableResponse = await this.handler.retrieveCachedResponse();
      if (!executableResponse) {
        let envMap = /* @__PURE__ */ new Map;
        if (envMap.set("GOOGLE_EXTERNAL_ACCOUNT_AUDIENCE", this.audience), envMap.set("GOOGLE_EXTERNAL_ACCOUNT_TOKEN_TYPE", this.subjectTokenType), envMap.set("GOOGLE_EXTERNAL_ACCOUNT_INTERACTIVE", "0"), this.outputFile)
          envMap.set("GOOGLE_EXTERNAL_ACCOUNT_OUTPUT_FILE", this.outputFile);
        let serviceAccountEmail = this.getServiceAccountEmail();
        if (serviceAccountEmail)
          envMap.set("GOOGLE_EXTERNAL_ACCOUNT_IMPERSONATED_EMAIL", serviceAccountEmail);
        executableResponse = await this.handler.retrieveResponseFromExecutable(envMap);
      }
      if (executableResponse.version > MAXIMUM_EXECUTABLE_VERSION)
        throw Error(`Version of executable is not currently supported, maximum supported version is ${MAXIMUM_EXECUTABLE_VERSION}.`);
      if (!executableResponse.success)
        throw new ExecutableError(executableResponse.errorMessage, executableResponse.errorCode);
      if (this.outputFile) {
        if (!executableResponse.expirationTime)
          throw new executable_response_1.InvalidExpirationTimeFieldError("The executable response must contain the `expiration_time` field for successful responses when an output_file has been specified in the configuration.");
      }
      if (executableResponse.isExpired())
        throw Error("Executable response is expired.");
      return executableResponse.subjectToken;
    }
  }
  exports.PluggableAuthClient = PluggableAuthClient;
});

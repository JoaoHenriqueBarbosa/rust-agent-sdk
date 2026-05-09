// var: init_errors4
var init_errors4 = __esm(() => {
  init_BedrockServiceException();
  AccessDeniedException = class AccessDeniedException extends BedrockServiceException {
    name = "AccessDeniedException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "AccessDeniedException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, AccessDeniedException.prototype);
    }
  };
  InternalServerException = class InternalServerException extends BedrockServiceException {
    name = "InternalServerException";
    $fault = "server";
    constructor(opts) {
      super({
        name: "InternalServerException",
        $fault: "server",
        ...opts
      });
      Object.setPrototypeOf(this, InternalServerException.prototype);
    }
  };
  ResourceNotFoundException = class ResourceNotFoundException extends BedrockServiceException {
    name = "ResourceNotFoundException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ResourceNotFoundException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
  };
  ThrottlingException = class ThrottlingException extends BedrockServiceException {
    name = "ThrottlingException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ThrottlingException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ThrottlingException.prototype);
    }
  };
  ValidationException = class ValidationException extends BedrockServiceException {
    name = "ValidationException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ValidationException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ValidationException.prototype);
    }
  };
  ConflictException = class ConflictException extends BedrockServiceException {
    name = "ConflictException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ConflictException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ConflictException.prototype);
    }
  };
  ServiceQuotaExceededException = class ServiceQuotaExceededException extends BedrockServiceException {
    name = "ServiceQuotaExceededException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ServiceQuotaExceededException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ServiceQuotaExceededException.prototype);
    }
  };
  TooManyTagsException = class TooManyTagsException extends BedrockServiceException {
    name = "TooManyTagsException";
    $fault = "client";
    resourceName;
    constructor(opts) {
      super({
        name: "TooManyTagsException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, TooManyTagsException.prototype), this.resourceName = opts.resourceName;
    }
  };
  ResourceInUseException = class ResourceInUseException extends BedrockServiceException {
    name = "ResourceInUseException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ResourceInUseException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ResourceInUseException.prototype);
    }
  };
  ServiceUnavailableException = class ServiceUnavailableException extends BedrockServiceException {
    name = "ServiceUnavailableException";
    $fault = "server";
    constructor(opts) {
      super({
        name: "ServiceUnavailableException",
        $fault: "server",
        ...opts
      });
      Object.setPrototypeOf(this, ServiceUnavailableException.prototype);
    }
  };
});

// var: init_errors5
var init_errors5 = __esm(() => {
  init_BedrockRuntimeServiceException();
  AccessDeniedException2 = class AccessDeniedException2 extends BedrockRuntimeServiceException {
    name = "AccessDeniedException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "AccessDeniedException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, AccessDeniedException2.prototype);
    }
  };
  InternalServerException2 = class InternalServerException2 extends BedrockRuntimeServiceException {
    name = "InternalServerException";
    $fault = "server";
    constructor(opts) {
      super({
        name: "InternalServerException",
        $fault: "server",
        ...opts
      });
      Object.setPrototypeOf(this, InternalServerException2.prototype);
    }
  };
  ThrottlingException2 = class ThrottlingException2 extends BedrockRuntimeServiceException {
    name = "ThrottlingException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ThrottlingException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ThrottlingException2.prototype);
    }
  };
  ValidationException2 = class ValidationException2 extends BedrockRuntimeServiceException {
    name = "ValidationException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ValidationException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ValidationException2.prototype);
    }
  };
  ConflictException2 = class ConflictException2 extends BedrockRuntimeServiceException {
    name = "ConflictException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ConflictException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ConflictException2.prototype);
    }
  };
  ResourceNotFoundException2 = class ResourceNotFoundException2 extends BedrockRuntimeServiceException {
    name = "ResourceNotFoundException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ResourceNotFoundException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ResourceNotFoundException2.prototype);
    }
  };
  ServiceQuotaExceededException2 = class ServiceQuotaExceededException2 extends BedrockRuntimeServiceException {
    name = "ServiceQuotaExceededException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ServiceQuotaExceededException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ServiceQuotaExceededException2.prototype);
    }
  };
  ServiceUnavailableException2 = class ServiceUnavailableException2 extends BedrockRuntimeServiceException {
    name = "ServiceUnavailableException";
    $fault = "server";
    constructor(opts) {
      super({
        name: "ServiceUnavailableException",
        $fault: "server",
        ...opts
      });
      Object.setPrototypeOf(this, ServiceUnavailableException2.prototype);
    }
  };
  ModelErrorException = class ModelErrorException extends BedrockRuntimeServiceException {
    name = "ModelErrorException";
    $fault = "client";
    originalStatusCode;
    resourceName;
    constructor(opts) {
      super({
        name: "ModelErrorException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ModelErrorException.prototype), this.originalStatusCode = opts.originalStatusCode, this.resourceName = opts.resourceName;
    }
  };
  ModelNotReadyException = class ModelNotReadyException extends BedrockRuntimeServiceException {
    name = "ModelNotReadyException";
    $fault = "client";
    $retryable = {};
    constructor(opts) {
      super({
        name: "ModelNotReadyException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ModelNotReadyException.prototype);
    }
  };
  ModelTimeoutException = class ModelTimeoutException extends BedrockRuntimeServiceException {
    name = "ModelTimeoutException";
    $fault = "client";
    constructor(opts) {
      super({
        name: "ModelTimeoutException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ModelTimeoutException.prototype);
    }
  };
  ModelStreamErrorException = class ModelStreamErrorException extends BedrockRuntimeServiceException {
    name = "ModelStreamErrorException";
    $fault = "client";
    originalStatusCode;
    originalMessage;
    constructor(opts) {
      super({
        name: "ModelStreamErrorException",
        $fault: "client",
        ...opts
      });
      Object.setPrototypeOf(this, ModelStreamErrorException.prototype), this.originalStatusCode = opts.originalStatusCode, this.originalMessage = opts.originalMessage;
    }
  };
});

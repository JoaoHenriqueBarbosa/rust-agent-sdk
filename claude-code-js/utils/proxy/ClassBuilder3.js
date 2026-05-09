// class: ClassBuilder3
class ClassBuilder3 {
  _init = () => {};
  _ep = {};
  _middlewareFn = () => [];
  _commandName = "";
  _clientName = "";
  _additionalContext = {};
  _smithyContext = {};
  _inputFilterSensitiveLog = void 0;
  _outputFilterSensitiveLog = void 0;
  _serializer = null;
  _deserializer = null;
  _operationSchema;
  init(cb) {
    this._init = cb;
  }
  ep(endpointParameterInstructions) {
    return this._ep = endpointParameterInstructions, this;
  }
  m(middlewareSupplier) {
    return this._middlewareFn = middlewareSupplier, this;
  }
  s(service, operation, smithyContext = {}) {
    return this._smithyContext = {
      service,
      operation,
      ...smithyContext
    }, this;
  }
  c(additionalContext = {}) {
    return this._additionalContext = additionalContext, this;
  }
  n(clientName, commandName) {
    return this._clientName = clientName, this._commandName = commandName, this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    return this._inputFilterSensitiveLog = inputFilter, this._outputFilterSensitiveLog = outputFilter, this;
  }
  ser(serializer) {
    return this._serializer = serializer, this;
  }
  de(deserializer) {
    return this._deserializer = deserializer, this;
  }
  sc(operation) {
    return this._operationSchema = operation, this._smithyContext.operationSchema = operation, this;
  }
  build() {
    let closure = this, CommandRef;
    return CommandRef = class extends Command3 {
      input;
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.input = input ?? {}, closure._init(this), this.schema = closure._operationSchema;
      }
      resolveMiddleware(stack, configuration, options) {
        let op = closure._operationSchema, input = op?.[4] ?? op?.input, output = op?.[5] ?? op?.output;
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter3.bind(null, input) : (_) => _),
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter3.bind(null, output) : (_) => _),
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
      serialize = closure._serializer;
      deserialize = closure._deserializer;
    };
  }
}

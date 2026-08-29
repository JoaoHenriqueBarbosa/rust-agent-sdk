// class: Command3
class Command3 {
  middlewareStack = import_middleware_stack6.constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder3;
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (let mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options))
      this.middlewareStack.use(mw);
    let stack = clientStack.concat(this.middlewareStack), { logger: logger4 } = configuration, handlerExecutionContext = {
      logger: logger4,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY3]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    }, { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
}

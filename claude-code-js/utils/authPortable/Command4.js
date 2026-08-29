// class: Command4
class Command4 {
  middlewareStack = import_middleware_stack8.constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder4;
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (let mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options))
      this.middlewareStack.use(mw);
    let stack = clientStack.concat(this.middlewareStack), { logger: logger5 } = configuration, handlerExecutionContext = {
      logger: logger5,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY4]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    }, { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
}

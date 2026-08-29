// class: Command2
class Command2 {
  middlewareStack = import_middleware_stack4.constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder2;
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (let mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options))
      this.middlewareStack.use(mw);
    let stack = clientStack.concat(this.middlewareStack), { logger: logger3 } = configuration, handlerExecutionContext = {
      logger: logger3,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY2]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    }, { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
}

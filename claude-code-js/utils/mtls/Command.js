// class: Command
class Command {
  middlewareStack = import_middleware_stack2.constructStack();
  schema;
  static classBuilder() {
    return new ClassBuilder;
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (let mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options))
      this.middlewareStack.use(mw);
    let stack = clientStack.concat(this.middlewareStack), { logger: logger2 } = configuration, handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: {
        commandInstance: this,
        ...smithyContext
      },
      ...additionalContext
    }, { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
}

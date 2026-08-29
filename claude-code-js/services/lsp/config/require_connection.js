// var: require_connection
var require_connection = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createMessageConnection = exports.ConnectionOptions = exports.MessageStrategy = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.RequestCancellationReceiverStrategy = exports.IdCancellationReceiverStrategy = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.TraceValues = exports.Trace = exports.NullLogger = exports.ProgressType = exports.ProgressToken = void 0;
  var ral_1 = require_ral(), Is = require_is(), messages_1 = require_messages(), linkedMap_1 = require_linkedMap(), events_1 = require_events(), cancellation_1 = require_cancellation(), CancelNotification;
  (function(CancelNotification2) {
    CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
  })(CancelNotification || (CancelNotification = {}));
  var ProgressToken;
  (function(ProgressToken2) {
    function is(value) {
      return typeof value === "string" || typeof value === "number";
    }
    ProgressToken2.is = is;
  })(ProgressToken || (exports.ProgressToken = ProgressToken = {}));
  var ProgressNotification;
  (function(ProgressNotification2) {
    ProgressNotification2.type = new messages_1.NotificationType("$/progress");
  })(ProgressNotification || (ProgressNotification = {}));

  class ProgressType {
    constructor() {}
  }
  exports.ProgressType = ProgressType;
  var StarRequestHandler;
  (function(StarRequestHandler2) {
    function is(value) {
      return Is.func(value);
    }
    StarRequestHandler2.is = is;
  })(StarRequestHandler || (StarRequestHandler = {}));
  exports.NullLogger = Object.freeze({
    error: () => {},
    warn: () => {},
    info: () => {},
    log: () => {}
  });
  var Trace2;
  (function(Trace3) {
    Trace3[Trace3.Off = 0] = "Off", Trace3[Trace3.Messages = 1] = "Messages", Trace3[Trace3.Compact = 2] = "Compact", Trace3[Trace3.Verbose = 3] = "Verbose";
  })(Trace2 || (exports.Trace = Trace2 = {}));
  var TraceValues;
  (function(TraceValues2) {
    TraceValues2.Off = "off", TraceValues2.Messages = "messages", TraceValues2.Compact = "compact", TraceValues2.Verbose = "verbose";
  })(TraceValues || (exports.TraceValues = TraceValues = {}));
  (function(Trace3) {
    function fromString6(value) {
      if (!Is.string(value))
        return Trace3.Off;
      switch (value = value.toLowerCase(), value) {
        case "off":
          return Trace3.Off;
        case "messages":
          return Trace3.Messages;
        case "compact":
          return Trace3.Compact;
        case "verbose":
          return Trace3.Verbose;
        default:
          return Trace3.Off;
      }
    }
    Trace3.fromString = fromString6;
    function toString5(value) {
      switch (value) {
        case Trace3.Off:
          return "off";
        case Trace3.Messages:
          return "messages";
        case Trace3.Compact:
          return "compact";
        case Trace3.Verbose:
          return "verbose";
        default:
          return "off";
      }
    }
    Trace3.toString = toString5;
  })(Trace2 || (exports.Trace = Trace2 = {}));
  var TraceFormat;
  (function(TraceFormat2) {
    TraceFormat2.Text = "text", TraceFormat2.JSON = "json";
  })(TraceFormat || (exports.TraceFormat = TraceFormat = {}));
  (function(TraceFormat2) {
    function fromString6(value) {
      if (!Is.string(value))
        return TraceFormat2.Text;
      if (value = value.toLowerCase(), value === "json")
        return TraceFormat2.JSON;
      else
        return TraceFormat2.Text;
    }
    TraceFormat2.fromString = fromString6;
  })(TraceFormat || (exports.TraceFormat = TraceFormat = {}));
  var SetTraceNotification;
  (function(SetTraceNotification2) {
    SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
  })(SetTraceNotification || (exports.SetTraceNotification = SetTraceNotification = {}));
  var LogTraceNotification;
  (function(LogTraceNotification2) {
    LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
  })(LogTraceNotification || (exports.LogTraceNotification = LogTraceNotification = {}));
  var ConnectionErrors;
  (function(ConnectionErrors2) {
    ConnectionErrors2[ConnectionErrors2.Closed = 1] = "Closed", ConnectionErrors2[ConnectionErrors2.Disposed = 2] = "Disposed", ConnectionErrors2[ConnectionErrors2.AlreadyListening = 3] = "AlreadyListening";
  })(ConnectionErrors || (exports.ConnectionErrors = ConnectionErrors = {}));

  class ConnectionError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code, Object.setPrototypeOf(this, ConnectionError.prototype);
    }
  }
  exports.ConnectionError = ConnectionError;
  var ConnectionStrategy;
  (function(ConnectionStrategy2) {
    function is(value) {
      let candidate = value;
      return candidate && Is.func(candidate.cancelUndispatched);
    }
    ConnectionStrategy2.is = is;
  })(ConnectionStrategy || (exports.ConnectionStrategy = ConnectionStrategy = {}));
  var IdCancellationReceiverStrategy;
  (function(IdCancellationReceiverStrategy2) {
    function is(value) {
      let candidate = value;
      return candidate && (candidate.kind === void 0 || candidate.kind === "id") && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
    }
    IdCancellationReceiverStrategy2.is = is;
  })(IdCancellationReceiverStrategy || (exports.IdCancellationReceiverStrategy = IdCancellationReceiverStrategy = {}));
  var RequestCancellationReceiverStrategy;
  (function(RequestCancellationReceiverStrategy2) {
    function is(value) {
      let candidate = value;
      return candidate && candidate.kind === "request" && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
    }
    RequestCancellationReceiverStrategy2.is = is;
  })(RequestCancellationReceiverStrategy || (exports.RequestCancellationReceiverStrategy = RequestCancellationReceiverStrategy = {}));
  var CancellationReceiverStrategy;
  (function(CancellationReceiverStrategy2) {
    CancellationReceiverStrategy2.Message = Object.freeze({
      createCancellationTokenSource(_) {
        return new cancellation_1.CancellationTokenSource;
      }
    });
    function is(value) {
      return IdCancellationReceiverStrategy.is(value) || RequestCancellationReceiverStrategy.is(value);
    }
    CancellationReceiverStrategy2.is = is;
  })(CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = CancellationReceiverStrategy = {}));
  var CancellationSenderStrategy;
  (function(CancellationSenderStrategy2) {
    CancellationSenderStrategy2.Message = Object.freeze({
      sendCancellation(conn, id) {
        return conn.sendNotification(CancelNotification.type, { id });
      },
      cleanup(_) {}
    });
    function is(value) {
      let candidate = value;
      return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
    }
    CancellationSenderStrategy2.is = is;
  })(CancellationSenderStrategy || (exports.CancellationSenderStrategy = CancellationSenderStrategy = {}));
  var CancellationStrategy;
  (function(CancellationStrategy2) {
    CancellationStrategy2.Message = Object.freeze({
      receiver: CancellationReceiverStrategy.Message,
      sender: CancellationSenderStrategy.Message
    });
    function is(value) {
      let candidate = value;
      return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
    }
    CancellationStrategy2.is = is;
  })(CancellationStrategy || (exports.CancellationStrategy = CancellationStrategy = {}));
  var MessageStrategy;
  (function(MessageStrategy2) {
    function is(value) {
      let candidate = value;
      return candidate && Is.func(candidate.handleMessage);
    }
    MessageStrategy2.is = is;
  })(MessageStrategy || (exports.MessageStrategy = MessageStrategy = {}));
  var ConnectionOptions;
  (function(ConnectionOptions2) {
    function is(value) {
      let candidate = value;
      return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy) || MessageStrategy.is(candidate.messageStrategy));
    }
    ConnectionOptions2.is = is;
  })(ConnectionOptions || (exports.ConnectionOptions = ConnectionOptions = {}));
  var ConnectionState;
  (function(ConnectionState2) {
    ConnectionState2[ConnectionState2.New = 1] = "New", ConnectionState2[ConnectionState2.Listening = 2] = "Listening", ConnectionState2[ConnectionState2.Closed = 3] = "Closed", ConnectionState2[ConnectionState2.Disposed = 4] = "Disposed";
  })(ConnectionState || (ConnectionState = {}));
  function createMessageConnection(messageReader, messageWriter, _logger, options2) {
    let logger34 = _logger !== void 0 ? _logger : exports.NullLogger, sequenceNumber = 0, notificationSequenceNumber = 0, unknownResponseSequenceNumber = 0, version5 = "2.0", starRequestHandler = void 0, requestHandlers = /* @__PURE__ */ new Map, starNotificationHandler = void 0, notificationHandlers = /* @__PURE__ */ new Map, progressHandlers = /* @__PURE__ */ new Map, timer, messageQueue = new linkedMap_1.LinkedMap, responsePromises = /* @__PURE__ */ new Map, knownCanceledRequests = /* @__PURE__ */ new Set, requestTokens = /* @__PURE__ */ new Map, trace7 = Trace2.Off, traceFormat = TraceFormat.Text, tracer, state3 = ConnectionState.New, errorEmitter = new events_1.Emitter, closeEmitter = new events_1.Emitter, unhandledNotificationEmitter = new events_1.Emitter, unhandledProgressEmitter = new events_1.Emitter, disposeEmitter = new events_1.Emitter, cancellationStrategy = options2 && options2.cancellationStrategy ? options2.cancellationStrategy : CancellationStrategy.Message;
    function createRequestQueueKey(id) {
      if (id === null)
        throw Error("Can't send requests with id null since the response can't be correlated.");
      return "req-" + id.toString();
    }
    function createResponseQueueKey(id) {
      if (id === null)
        return "res-unknown-" + (++unknownResponseSequenceNumber).toString();
      else
        return "res-" + id.toString();
    }
    function createNotificationQueueKey() {
      return "not-" + (++notificationSequenceNumber).toString();
    }
    function addMessageToQueue(queue2, message) {
      if (messages_1.Message.isRequest(message))
        queue2.set(createRequestQueueKey(message.id), message);
      else if (messages_1.Message.isResponse(message))
        queue2.set(createResponseQueueKey(message.id), message);
      else
        queue2.set(createNotificationQueueKey(), message);
    }
    function cancelUndispatched(_message) {
      return;
    }
    function isListening() {
      return state3 === ConnectionState.Listening;
    }
    function isClosed() {
      return state3 === ConnectionState.Closed;
    }
    function isDisposed() {
      return state3 === ConnectionState.Disposed;
    }
    function closeHandler() {
      if (state3 === ConnectionState.New || state3 === ConnectionState.Listening)
        state3 = ConnectionState.Closed, closeEmitter.fire(void 0);
    }
    function readErrorHandler(error44) {
      errorEmitter.fire([error44, void 0, void 0]);
    }
    function writeErrorHandler(data) {
      errorEmitter.fire(data);
    }
    messageReader.onClose(closeHandler), messageReader.onError(readErrorHandler), messageWriter.onClose(closeHandler), messageWriter.onError(writeErrorHandler);
    function triggerMessageQueue() {
      if (timer || messageQueue.size === 0)
        return;
      timer = (0, ral_1.default)().timer.setImmediate(() => {
        timer = void 0, processMessageQueue();
      });
    }
    function handleMessage(message) {
      if (messages_1.Message.isRequest(message))
        handleRequest(message);
      else if (messages_1.Message.isNotification(message))
        handleNotification(message);
      else if (messages_1.Message.isResponse(message))
        handleResponse(message);
      else
        handleInvalidMessage(message);
    }
    function processMessageQueue() {
      if (messageQueue.size === 0)
        return;
      let message = messageQueue.shift();
      try {
        let messageStrategy = options2?.messageStrategy;
        if (MessageStrategy.is(messageStrategy))
          messageStrategy.handleMessage(message, handleMessage);
        else
          handleMessage(message);
      } finally {
        triggerMessageQueue();
      }
    }
    let callback = (message) => {
      try {
        if (messages_1.Message.isNotification(message) && message.method === CancelNotification.type.method) {
          let cancelId = message.params.id, key2 = createRequestQueueKey(cancelId), toCancel = messageQueue.get(key2);
          if (messages_1.Message.isRequest(toCancel)) {
            let strategy = options2?.connectionStrategy, response7 = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
            if (response7 && (response7.error !== void 0 || response7.result !== void 0)) {
              messageQueue.delete(key2), requestTokens.delete(cancelId), response7.id = toCancel.id, traceSendingResponse(response7, message.method, Date.now()), messageWriter.write(response7).catch(() => logger34.error("Sending response for canceled message failed."));
              return;
            }
          }
          let cancellationToken = requestTokens.get(cancelId);
          if (cancellationToken !== void 0) {
            cancellationToken.cancel(), traceReceivedNotification(message);
            return;
          } else
            knownCanceledRequests.add(cancelId);
        }
        addMessageToQueue(messageQueue, message);
      } finally {
        triggerMessageQueue();
      }
    };
    function handleRequest(requestMessage) {
      if (isDisposed())
        return;
      function reply(resultOrError, method, startTime2) {
        let message = {
          jsonrpc: version5,
          id: requestMessage.id
        };
        if (resultOrError instanceof messages_1.ResponseError)
          message.error = resultOrError.toJson();
        else
          message.result = resultOrError === void 0 ? null : resultOrError;
        traceSendingResponse(message, method, startTime2), messageWriter.write(message).catch(() => logger34.error("Sending response failed."));
      }
      function replyError(error44, method, startTime2) {
        let message = {
          jsonrpc: version5,
          id: requestMessage.id,
          error: error44.toJson()
        };
        traceSendingResponse(message, method, startTime2), messageWriter.write(message).catch(() => logger34.error("Sending response failed."));
      }
      function replySuccess(result, method, startTime2) {
        if (result === void 0)
          result = null;
        let message = {
          jsonrpc: version5,
          id: requestMessage.id,
          result
        };
        traceSendingResponse(message, method, startTime2), messageWriter.write(message).catch(() => logger34.error("Sending response failed."));
      }
      traceReceivedRequest(requestMessage);
      let element = requestHandlers.get(requestMessage.method), type, requestHandler;
      if (element)
        type = element.type, requestHandler = element.handler;
      let startTime = Date.now();
      if (requestHandler || starRequestHandler) {
        let tokenKey = requestMessage.id ?? String(Date.now()), cancellationSource = IdCancellationReceiverStrategy.is(cancellationStrategy.receiver) ? cancellationStrategy.receiver.createCancellationTokenSource(tokenKey) : cancellationStrategy.receiver.createCancellationTokenSource(requestMessage);
        if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id))
          cancellationSource.cancel();
        if (requestMessage.id !== null)
          requestTokens.set(tokenKey, cancellationSource);
        try {
          let handlerResult;
          if (requestHandler)
            if (requestMessage.params === void 0) {
              if (type !== void 0 && type.numberOfParams !== 0) {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
                return;
              }
              handlerResult = requestHandler(cancellationSource.token);
            } else if (Array.isArray(requestMessage.params)) {
              if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                return;
              }
              handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
            } else {
              if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                return;
              }
              handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
            }
          else if (starRequestHandler)
            handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
          let promise3 = handlerResult;
          if (!handlerResult)
            requestTokens.delete(tokenKey), replySuccess(handlerResult, requestMessage.method, startTime);
          else if (promise3.then)
            promise3.then((resultOrError) => {
              requestTokens.delete(tokenKey), reply(resultOrError, requestMessage.method, startTime);
            }, (error44) => {
              if (requestTokens.delete(tokenKey), error44 instanceof messages_1.ResponseError)
                replyError(error44, requestMessage.method, startTime);
              else if (error44 && Is.string(error44.message))
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error44.message}`), requestMessage.method, startTime);
              else
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
            });
          else
            requestTokens.delete(tokenKey), reply(handlerResult, requestMessage.method, startTime);
        } catch (error44) {
          if (requestTokens.delete(tokenKey), error44 instanceof messages_1.ResponseError)
            reply(error44, requestMessage.method, startTime);
          else if (error44 && Is.string(error44.message))
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error44.message}`), requestMessage.method, startTime);
          else
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
        }
      } else
        replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
    }
    function handleResponse(responseMessage) {
      if (isDisposed())
        return;
      if (responseMessage.id === null)
        if (responseMessage.error)
          logger34.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
        else
          logger34.error("Received response message without id. No further error information provided.");
      else {
        let key2 = responseMessage.id, responsePromise = responsePromises.get(key2);
        if (traceReceivedResponse(responseMessage, responsePromise), responsePromise !== void 0) {
          responsePromises.delete(key2);
          try {
            if (responseMessage.error) {
              let error44 = responseMessage.error;
              responsePromise.reject(new messages_1.ResponseError(error44.code, error44.message, error44.data));
            } else if (responseMessage.result !== void 0)
              responsePromise.resolve(responseMessage.result);
            else
              throw Error("Should never happen.");
          } catch (error44) {
            if (error44.message)
              logger34.error(`Response handler '${responsePromise.method}' failed with message: ${error44.message}`);
            else
              logger34.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
          }
        }
      }
    }
    function handleNotification(message) {
      if (isDisposed())
        return;
      let type = void 0, notificationHandler;
      if (message.method === CancelNotification.type.method) {
        let cancelId = message.params.id;
        knownCanceledRequests.delete(cancelId), traceReceivedNotification(message);
        return;
      } else {
        let element = notificationHandlers.get(message.method);
        if (element)
          notificationHandler = element.handler, type = element.type;
      }
      if (notificationHandler || starNotificationHandler)
        try {
          if (traceReceivedNotification(message), notificationHandler)
            if (message.params === void 0) {
              if (type !== void 0) {
                if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName)
                  logger34.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
              }
              notificationHandler();
            } else if (Array.isArray(message.params)) {
              let params = message.params;
              if (message.method === ProgressNotification.type.method && params.length === 2 && ProgressToken.is(params[0]))
                notificationHandler({ token: params[0], value: params[1] });
              else {
                if (type !== void 0) {
                  if (type.parameterStructures === messages_1.ParameterStructures.byName)
                    logger34.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                  if (type.numberOfParams !== message.params.length)
                    logger34.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${params.length} arguments`);
                }
                notificationHandler(...params);
              }
            } else {
              if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition)
                logger34.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
              notificationHandler(message.params);
            }
          else if (starNotificationHandler)
            starNotificationHandler(message.method, message.params);
        } catch (error44) {
          if (error44.message)
            logger34.error(`Notification handler '${message.method}' failed with message: ${error44.message}`);
          else
            logger34.error(`Notification handler '${message.method}' failed unexpectedly.`);
        }
      else
        unhandledNotificationEmitter.fire(message);
    }
    function handleInvalidMessage(message) {
      if (!message) {
        logger34.error("Received empty message.");
        return;
      }
      logger34.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
      let responseMessage = message;
      if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
        let key2 = responseMessage.id, responseHandler = responsePromises.get(key2);
        if (responseHandler)
          responseHandler.reject(Error("The received response has neither a result nor an error property."));
      }
    }
    function stringifyTrace(params) {
      if (params === void 0 || params === null)
        return;
      switch (trace7) {
        case Trace2.Verbose:
          return JSON.stringify(params, null, 4);
        case Trace2.Compact:
          return JSON.stringify(params);
        default:
          return;
      }
    }
    function traceSendingRequest(message) {
      if (trace7 === Trace2.Off || !tracer)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if ((trace7 === Trace2.Verbose || trace7 === Trace2.Compact) && message.params)
          data = `Params: ${stringifyTrace(message.params)}

`;
        tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
      } else
        logLSPMessage("send-request", message);
    }
    function traceSendingNotification(message) {
      if (trace7 === Trace2.Off || !tracer)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if (trace7 === Trace2.Verbose || trace7 === Trace2.Compact)
          if (message.params)
            data = `Params: ${stringifyTrace(message.params)}

`;
          else
            data = `No parameters provided.

`;
        tracer.log(`Sending notification '${message.method}'.`, data);
      } else
        logLSPMessage("send-notification", message);
    }
    function traceSendingResponse(message, method, startTime) {
      if (trace7 === Trace2.Off || !tracer)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if (trace7 === Trace2.Verbose || trace7 === Trace2.Compact) {
          if (message.error && message.error.data)
            data = `Error data: ${stringifyTrace(message.error.data)}

`;
          else if (message.result)
            data = `Result: ${stringifyTrace(message.result)}

`;
          else if (message.error === void 0)
            data = `No result returned.

`;
        }
        tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
      } else
        logLSPMessage("send-response", message);
    }
    function traceReceivedRequest(message) {
      if (trace7 === Trace2.Off || !tracer)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if ((trace7 === Trace2.Verbose || trace7 === Trace2.Compact) && message.params)
          data = `Params: ${stringifyTrace(message.params)}

`;
        tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
      } else
        logLSPMessage("receive-request", message);
    }
    function traceReceivedNotification(message) {
      if (trace7 === Trace2.Off || !tracer || message.method === LogTraceNotification.type.method)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if (trace7 === Trace2.Verbose || trace7 === Trace2.Compact)
          if (message.params)
            data = `Params: ${stringifyTrace(message.params)}

`;
          else
            data = `No parameters provided.

`;
        tracer.log(`Received notification '${message.method}'.`, data);
      } else
        logLSPMessage("receive-notification", message);
    }
    function traceReceivedResponse(message, responsePromise) {
      if (trace7 === Trace2.Off || !tracer)
        return;
      if (traceFormat === TraceFormat.Text) {
        let data = void 0;
        if (trace7 === Trace2.Verbose || trace7 === Trace2.Compact) {
          if (message.error && message.error.data)
            data = `Error data: ${stringifyTrace(message.error.data)}

`;
          else if (message.result)
            data = `Result: ${stringifyTrace(message.result)}

`;
          else if (message.error === void 0)
            data = `No result returned.

`;
        }
        if (responsePromise) {
          let error44 = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
          tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error44}`, data);
        } else
          tracer.log(`Received response ${message.id} without active response promise.`, data);
      } else
        logLSPMessage("receive-response", message);
    }
    function logLSPMessage(type, message) {
      if (!tracer || trace7 === Trace2.Off)
        return;
      let lspMessage = {
        isLSPMessage: !0,
        type,
        message,
        timestamp: Date.now()
      };
      tracer.log(lspMessage);
    }
    function throwIfClosedOrDisposed() {
      if (isClosed())
        throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
      if (isDisposed())
        throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
    }
    function throwIfListening() {
      if (isListening())
        throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
    }
    function throwIfNotListening() {
      if (!isListening())
        throw Error("Call listen() first.");
    }
    function undefinedToNull(param) {
      if (param === void 0)
        return null;
      else
        return param;
    }
    function nullToUndefined(param) {
      if (param === null)
        return;
      else
        return param;
    }
    function isNamedParam(param) {
      return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
    }
    function computeSingleParam(parameterStructures, param) {
      switch (parameterStructures) {
        case messages_1.ParameterStructures.auto:
          if (isNamedParam(param))
            return nullToUndefined(param);
          else
            return [undefinedToNull(param)];
        case messages_1.ParameterStructures.byName:
          if (!isNamedParam(param))
            throw Error("Received parameters by name but param is not an object literal.");
          return nullToUndefined(param);
        case messages_1.ParameterStructures.byPosition:
          return [undefinedToNull(param)];
        default:
          throw Error(`Unknown parameter structure ${parameterStructures.toString()}`);
      }
    }
    function computeMessageParams(type, params) {
      let result, numberOfParams = type.numberOfParams;
      switch (numberOfParams) {
        case 0:
          result = void 0;
          break;
        case 1:
          result = computeSingleParam(type.parameterStructures, params[0]);
          break;
        default:
          result = [];
          for (let i5 = 0;i5 < params.length && i5 < numberOfParams; i5++)
            result.push(undefinedToNull(params[i5]));
          if (params.length < numberOfParams)
            for (let i5 = params.length;i5 < numberOfParams; i5++)
              result.push(null);
          break;
      }
      return result;
    }
    let connection7 = {
      sendNotification: (type, ...args) => {
        throwIfClosedOrDisposed();
        let method, messageParams;
        if (Is.string(type)) {
          method = type;
          let first = args[0], paramStart = 0, parameterStructures = messages_1.ParameterStructures.auto;
          if (messages_1.ParameterStructures.is(first))
            paramStart = 1, parameterStructures = first;
          let paramEnd = args.length, numberOfParams = paramEnd - paramStart;
          switch (numberOfParams) {
            case 0:
              messageParams = void 0;
              break;
            case 1:
              messageParams = computeSingleParam(parameterStructures, args[paramStart]);
              break;
            default:
              if (parameterStructures === messages_1.ParameterStructures.byName)
                throw Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
              messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
              break;
          }
        } else {
          let params = args;
          method = type.method, messageParams = computeMessageParams(type, params);
        }
        let notificationMessage = {
          jsonrpc: version5,
          method,
          params: messageParams
        };
        return traceSendingNotification(notificationMessage), messageWriter.write(notificationMessage).catch((error44) => {
          throw logger34.error("Sending notification failed."), error44;
        });
      },
      onNotification: (type, handler) => {
        throwIfClosedOrDisposed();
        let method;
        if (Is.func(type))
          starNotificationHandler = type;
        else if (handler)
          if (Is.string(type))
            method = type, notificationHandlers.set(type, { type: void 0, handler });
          else
            method = type.method, notificationHandlers.set(type.method, { type, handler });
        return {
          dispose: () => {
            if (method !== void 0)
              notificationHandlers.delete(method);
            else
              starNotificationHandler = void 0;
          }
        };
      },
      onProgress: (_type, token, handler) => {
        if (progressHandlers.has(token))
          throw Error(`Progress handler for token ${token} already registered`);
        return progressHandlers.set(token, handler), {
          dispose: () => {
            progressHandlers.delete(token);
          }
        };
      },
      sendProgress: (_type, token, value) => {
        return connection7.sendNotification(ProgressNotification.type, { token, value });
      },
      onUnhandledProgress: unhandledProgressEmitter.event,
      sendRequest: (type, ...args) => {
        throwIfClosedOrDisposed(), throwIfNotListening();
        let method, messageParams, token = void 0;
        if (Is.string(type)) {
          method = type;
          let first = args[0], last2 = args[args.length - 1], paramStart = 0, parameterStructures = messages_1.ParameterStructures.auto;
          if (messages_1.ParameterStructures.is(first))
            paramStart = 1, parameterStructures = first;
          let paramEnd = args.length;
          if (cancellation_1.CancellationToken.is(last2))
            paramEnd = paramEnd - 1, token = last2;
          let numberOfParams = paramEnd - paramStart;
          switch (numberOfParams) {
            case 0:
              messageParams = void 0;
              break;
            case 1:
              messageParams = computeSingleParam(parameterStructures, args[paramStart]);
              break;
            default:
              if (parameterStructures === messages_1.ParameterStructures.byName)
                throw Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
              messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
              break;
          }
        } else {
          let params = args;
          method = type.method, messageParams = computeMessageParams(type, params);
          let numberOfParams = type.numberOfParams;
          token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
        }
        let id = sequenceNumber++, disposable;
        if (token)
          disposable = token.onCancellationRequested(() => {
            let p4 = cancellationStrategy.sender.sendCancellation(connection7, id);
            if (p4 === void 0)
              return logger34.log(`Received no promise from cancellation strategy when cancelling id ${id}`), Promise.resolve();
            else
              return p4.catch(() => {
                logger34.log(`Sending cancellation messages for id ${id} failed`);
              });
          });
        let requestMessage = {
          jsonrpc: version5,
          id,
          method,
          params: messageParams
        };
        if (traceSendingRequest(requestMessage), typeof cancellationStrategy.sender.enableCancellation === "function")
          cancellationStrategy.sender.enableCancellation(requestMessage);
        return new Promise(async (resolve28, reject2) => {
          let resolveWithCleanup = (r4) => {
            resolve28(r4), cancellationStrategy.sender.cleanup(id), disposable?.dispose();
          }, rejectWithCleanup = (r4) => {
            reject2(r4), cancellationStrategy.sender.cleanup(id), disposable?.dispose();
          }, responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
          try {
            responsePromises.set(id, responsePromise), await messageWriter.write(requestMessage);
          } catch (error44) {
            throw responsePromises.delete(id), responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, error44.message ? error44.message : "Unknown reason")), logger34.error("Sending request failed."), error44;
          }
        });
      },
      onRequest: (type, handler) => {
        throwIfClosedOrDisposed();
        let method = null;
        if (StarRequestHandler.is(type))
          method = void 0, starRequestHandler = type;
        else if (Is.string(type)) {
          if (method = null, handler !== void 0)
            method = type, requestHandlers.set(type, { handler, type: void 0 });
        } else if (handler !== void 0)
          method = type.method, requestHandlers.set(type.method, { type, handler });
        return {
          dispose: () => {
            if (method === null)
              return;
            if (method !== void 0)
              requestHandlers.delete(method);
            else
              starRequestHandler = void 0;
          }
        };
      },
      hasPendingResponse: () => {
        return responsePromises.size > 0;
      },
      trace: async (_value, _tracer, sendNotificationOrTraceOptions) => {
        let _sendNotification = !1, _traceFormat = TraceFormat.Text;
        if (sendNotificationOrTraceOptions !== void 0)
          if (Is.boolean(sendNotificationOrTraceOptions))
            _sendNotification = sendNotificationOrTraceOptions;
          else
            _sendNotification = sendNotificationOrTraceOptions.sendNotification || !1, _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
        if (trace7 = _value, traceFormat = _traceFormat, trace7 === Trace2.Off)
          tracer = void 0;
        else
          tracer = _tracer;
        if (_sendNotification && !isClosed() && !isDisposed())
          await connection7.sendNotification(SetTraceNotification.type, { value: Trace2.toString(_value) });
      },
      onError: errorEmitter.event,
      onClose: closeEmitter.event,
      onUnhandledNotification: unhandledNotificationEmitter.event,
      onDispose: disposeEmitter.event,
      end: () => {
        messageWriter.end();
      },
      dispose: () => {
        if (isDisposed())
          return;
        state3 = ConnectionState.Disposed, disposeEmitter.fire(void 0);
        let error44 = new messages_1.ResponseError(messages_1.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
        for (let promise3 of responsePromises.values())
          promise3.reject(error44);
        if (responsePromises = /* @__PURE__ */ new Map, requestTokens = /* @__PURE__ */ new Map, knownCanceledRequests = /* @__PURE__ */ new Set, messageQueue = new linkedMap_1.LinkedMap, Is.func(messageWriter.dispose))
          messageWriter.dispose();
        if (Is.func(messageReader.dispose))
          messageReader.dispose();
      },
      listen: () => {
        throwIfClosedOrDisposed(), throwIfListening(), state3 = ConnectionState.Listening, messageReader.listen(callback);
      },
      inspect: () => {
        (0, ral_1.default)().console.log("inspect");
      }
    };
    return connection7.onNotification(LogTraceNotification.type, (params) => {
      if (trace7 === Trace2.Off || !tracer)
        return;
      let verbose = trace7 === Trace2.Verbose || trace7 === Trace2.Compact;
      tracer.log(params.message, verbose ? params.verbose : void 0);
    }), connection7.onNotification(ProgressNotification.type, (params) => {
      let handler = progressHandlers.get(params.token);
      if (handler)
        handler(params.value);
      else
        unhandledProgressEmitter.fire(params);
    }), connection7;
  }
  exports.createMessageConnection = createMessageConnection;
});

// class: Protocol
class Protocol {
  constructor(_options) {
    if (this._options = _options, this._requestMessageId = 0, this._requestHandlers = /* @__PURE__ */ new Map, this._requestHandlerAbortControllers = /* @__PURE__ */ new Map, this._notificationHandlers = /* @__PURE__ */ new Map, this._responseHandlers = /* @__PURE__ */ new Map, this._progressHandlers = /* @__PURE__ */ new Map, this._timeoutInfo = /* @__PURE__ */ new Map, this._pendingDebouncedNotifications = /* @__PURE__ */ new Set, this._taskProgressTokens = /* @__PURE__ */ new Map, this._requestResolvers = /* @__PURE__ */ new Map, this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
      this._oncancel(notification);
    }), this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
      this._onprogress(notification);
    }), this.setRequestHandler(PingRequestSchema, (_request) => ({})), this._taskStore = _options?.taskStore, this._taskMessageQueue = _options?.taskMessageQueue, this._taskStore)
      this.setRequestHandler(GetTaskRequestSchema, async (request2, extra) => {
        let task = await this._taskStore.getTask(request2.params.taskId, extra.sessionId);
        if (!task)
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        return {
          ...task
        };
      }), this.setRequestHandler(GetTaskPayloadRequestSchema, async (request2, extra) => {
        let handleTaskResult = async () => {
          let taskId = request2.params.taskId;
          if (this._taskMessageQueue) {
            let queuedMessage;
            while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
              if (queuedMessage.type === "response" || queuedMessage.type === "error") {
                let message = queuedMessage.message, requestId = message.id, resolver = this._requestResolvers.get(requestId);
                if (resolver)
                  if (this._requestResolvers.delete(requestId), queuedMessage.type === "response")
                    resolver(message);
                  else {
                    let errorMessage2 = message, error44 = new McpError(errorMessage2.error.code, errorMessage2.error.message, errorMessage2.error.data);
                    resolver(error44);
                  }
                else {
                  let messageType = queuedMessage.type === "response" ? "Response" : "Error";
                  this._onerror(Error(`${messageType} handler missing for request ${requestId}`));
                }
                continue;
              }
              await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
            }
          }
          let task = await this._taskStore.getTask(taskId, extra.sessionId);
          if (!task)
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
          if (!isTerminal(task.status))
            return await this._waitForTaskUpdate(taskId, extra.signal), await handleTaskResult();
          if (isTerminal(task.status)) {
            let result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
            return this._clearTaskQueue(taskId), {
              ...result,
              _meta: {
                ...result._meta,
                [RELATED_TASK_META_KEY]: {
                  taskId
                }
              }
            };
          }
          return await handleTaskResult();
        };
        return await handleTaskResult();
      }), this.setRequestHandler(ListTasksRequestSchema, async (request2, extra) => {
        try {
          let { tasks, nextCursor } = await this._taskStore.listTasks(request2.params?.cursor, extra.sessionId);
          return {
            tasks,
            nextCursor,
            _meta: {}
          };
        } catch (error44) {
          throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error44 instanceof Error ? error44.message : String(error44)}`);
        }
      }), this.setRequestHandler(CancelTaskRequestSchema, async (request2, extra) => {
        try {
          let task = await this._taskStore.getTask(request2.params.taskId, extra.sessionId);
          if (!task)
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request2.params.taskId}`);
          if (isTerminal(task.status))
            throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
          await this._taskStore.updateTaskStatus(request2.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId), this._clearTaskQueue(request2.params.taskId);
          let cancelledTask = await this._taskStore.getTask(request2.params.taskId, extra.sessionId);
          if (!cancelledTask)
            throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request2.params.taskId}`);
          return {
            _meta: {},
            ...cancelledTask
          };
        } catch (error44) {
          if (error44 instanceof McpError)
            throw error44;
          throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error44 instanceof Error ? error44.message : String(error44)}`);
        }
      });
  }
  async _oncancel(notification) {
    if (!notification.params.requestId)
      return;
    this._requestHandlerAbortControllers.get(notification.params.requestId)?.abort(notification.params.reason);
  }
  _setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = !1) {
    this._timeoutInfo.set(messageId, {
      timeoutId: setTimeout(onTimeout, timeout),
      startTime: Date.now(),
      timeout,
      maxTotalTimeout,
      resetTimeoutOnProgress,
      onTimeout
    });
  }
  _resetTimeout(messageId) {
    let info = this._timeoutInfo.get(messageId);
    if (!info)
      return !1;
    let totalElapsed = Date.now() - info.startTime;
    if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout)
      throw this._timeoutInfo.delete(messageId), McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: info.maxTotalTimeout,
        totalElapsed
      });
    return clearTimeout(info.timeoutId), info.timeoutId = setTimeout(info.onTimeout, info.timeout), !0;
  }
  _cleanupTimeout(messageId) {
    let info = this._timeoutInfo.get(messageId);
    if (info)
      clearTimeout(info.timeoutId), this._timeoutInfo.delete(messageId);
  }
  async connect(transport) {
    if (this._transport)
      throw Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
    this._transport = transport;
    let _onclose = this.transport?.onclose;
    this._transport.onclose = () => {
      _onclose?.(), this._onclose();
    };
    let _onerror = this.transport?.onerror;
    this._transport.onerror = (error44) => {
      _onerror?.(error44), this._onerror(error44);
    };
    let _onmessage = this._transport?.onmessage;
    this._transport.onmessage = (message, extra) => {
      if (_onmessage?.(message, extra), isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message))
        this._onresponse(message);
      else if (isJSONRPCRequest(message))
        this._onrequest(message, extra);
      else if (isJSONRPCNotification(message))
        this._onnotification(message);
      else
        this._onerror(Error(`Unknown message type: ${JSON.stringify(message)}`));
    }, await this._transport.start();
  }
  _onclose() {
    let responseHandlers = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map, this._progressHandlers.clear(), this._taskProgressTokens.clear(), this._pendingDebouncedNotifications.clear();
    for (let info of this._timeoutInfo.values())
      clearTimeout(info.timeoutId);
    this._timeoutInfo.clear();
    for (let controller of this._requestHandlerAbortControllers.values())
      controller.abort();
    this._requestHandlerAbortControllers.clear();
    let error44 = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
    this._transport = void 0, this.onclose?.();
    for (let handler of responseHandlers.values())
      handler(error44);
  }
  _onerror(error44) {
    this.onerror?.(error44);
  }
  _onnotification(notification) {
    let handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
    if (handler === void 0)
      return;
    Promise.resolve().then(() => handler(notification)).catch((error44) => this._onerror(Error(`Uncaught error in notification handler: ${error44}`)));
  }
  _onrequest(request2, extra) {
    let handler = this._requestHandlers.get(request2.method) ?? this.fallbackRequestHandler, capturedTransport = this._transport, relatedTaskId = request2.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
    if (handler === void 0) {
      let errorResponse = {
        jsonrpc: "2.0",
        id: request2.id,
        error: {
          code: ErrorCode.MethodNotFound,
          message: "Method not found"
        }
      };
      if (relatedTaskId && this._taskMessageQueue)
        this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId).catch((error44) => this._onerror(Error(`Failed to enqueue error response: ${error44}`)));
      else
        capturedTransport?.send(errorResponse).catch((error44) => this._onerror(Error(`Failed to send an error response: ${error44}`)));
      return;
    }
    let abortController = new AbortController;
    this._requestHandlerAbortControllers.set(request2.id, abortController);
    let taskCreationParams = isTaskAugmentedRequestParams(request2.params) ? request2.params.task : void 0, taskStore = this._taskStore ? this.requestTaskStore(request2, capturedTransport?.sessionId) : void 0, fullExtra = {
      signal: abortController.signal,
      sessionId: capturedTransport?.sessionId,
      _meta: request2.params?._meta,
      sendNotification: async (notification) => {
        if (abortController.signal.aborted)
          return;
        let notificationOptions = { relatedRequestId: request2.id };
        if (relatedTaskId)
          notificationOptions.relatedTask = { taskId: relatedTaskId };
        await this.notification(notification, notificationOptions);
      },
      sendRequest: async (r4, resultSchema, options2) => {
        if (abortController.signal.aborted)
          throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
        let requestOptions = { ...options2, relatedRequestId: request2.id };
        if (relatedTaskId && !requestOptions.relatedTask)
          requestOptions.relatedTask = { taskId: relatedTaskId };
        let effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
        if (effectiveTaskId && taskStore)
          await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
        return await this.request(r4, resultSchema, requestOptions);
      },
      authInfo: extra?.authInfo,
      requestId: request2.id,
      requestInfo: extra?.requestInfo,
      taskId: relatedTaskId,
      taskStore,
      taskRequestedTtl: taskCreationParams?.ttl,
      closeSSEStream: extra?.closeSSEStream,
      closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
    };
    Promise.resolve().then(() => {
      if (taskCreationParams)
        this.assertTaskHandlerCapability(request2.method);
    }).then(() => handler(request2, fullExtra)).then(async (result) => {
      if (abortController.signal.aborted)
        return;
      let response7 = {
        result,
        jsonrpc: "2.0",
        id: request2.id
      };
      if (relatedTaskId && this._taskMessageQueue)
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "response",
          message: response7,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      else
        await capturedTransport?.send(response7);
    }, async (error44) => {
      if (abortController.signal.aborted)
        return;
      let errorResponse = {
        jsonrpc: "2.0",
        id: request2.id,
        error: {
          code: Number.isSafeInteger(error44.code) ? error44.code : ErrorCode.InternalError,
          message: error44.message ?? "Internal error",
          ...error44.data !== void 0 && { data: error44.data }
        }
      };
      if (relatedTaskId && this._taskMessageQueue)
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      else
        await capturedTransport?.send(errorResponse);
    }).catch((error44) => this._onerror(Error(`Failed to send response: ${error44}`))).finally(() => {
      if (this._requestHandlerAbortControllers.get(request2.id) === abortController)
        this._requestHandlerAbortControllers.delete(request2.id);
    });
  }
  _onprogress(notification) {
    let { progressToken, ...params } = notification.params, messageId = Number(progressToken), handler = this._progressHandlers.get(messageId);
    if (!handler) {
      this._onerror(Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
      return;
    }
    let responseHandler = this._responseHandlers.get(messageId), timeoutInfo = this._timeoutInfo.get(messageId);
    if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress)
      try {
        this._resetTimeout(messageId);
      } catch (error44) {
        this._responseHandlers.delete(messageId), this._progressHandlers.delete(messageId), this._cleanupTimeout(messageId), responseHandler(error44);
        return;
      }
    handler(params);
  }
  _onresponse(response7) {
    let messageId = Number(response7.id), resolver = this._requestResolvers.get(messageId);
    if (resolver) {
      if (this._requestResolvers.delete(messageId), isJSONRPCResultResponse(response7))
        resolver(response7);
      else {
        let error44 = new McpError(response7.error.code, response7.error.message, response7.error.data);
        resolver(error44);
      }
      return;
    }
    let handler = this._responseHandlers.get(messageId);
    if (handler === void 0) {
      this._onerror(Error(`Received a response for an unknown message ID: ${JSON.stringify(response7)}`));
      return;
    }
    this._responseHandlers.delete(messageId), this._cleanupTimeout(messageId);
    let isTaskResponse = !1;
    if (isJSONRPCResultResponse(response7) && response7.result && typeof response7.result === "object") {
      let result = response7.result;
      if (result.task && typeof result.task === "object") {
        let task = result.task;
        if (typeof task.taskId === "string")
          isTaskResponse = !0, this._taskProgressTokens.set(task.taskId, messageId);
      }
    }
    if (!isTaskResponse)
      this._progressHandlers.delete(messageId);
    if (isJSONRPCResultResponse(response7))
      handler(response7);
    else {
      let error44 = McpError.fromError(response7.error.code, response7.error.message, response7.error.data);
      handler(error44);
    }
  }
  get transport() {
    return this._transport;
  }
  async close() {
    await this._transport?.close();
  }
  async* requestStream(request2, resultSchema, options2) {
    let { task } = options2 ?? {};
    if (!task) {
      try {
        yield { type: "result", result: await this.request(request2, resultSchema, options2) };
      } catch (error44) {
        yield {
          type: "error",
          error: error44 instanceof McpError ? error44 : new McpError(ErrorCode.InternalError, String(error44))
        };
      }
      return;
    }
    let taskId;
    try {
      let createResult = await this.request(request2, CreateTaskResultSchema, options2);
      if (createResult.task)
        taskId = createResult.task.taskId, yield { type: "taskCreated", task: createResult.task };
      else
        throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
      while (!0) {
        let task2 = await this.getTask({ taskId }, options2);
        if (yield { type: "taskStatus", task: task2 }, isTerminal(task2.status)) {
          if (task2.status === "completed")
            yield { type: "result", result: await this.getTaskResult({ taskId }, resultSchema, options2) };
          else if (task2.status === "failed")
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
            };
          else if (task2.status === "cancelled")
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
            };
          return;
        }
        if (task2.status === "input_required") {
          yield { type: "result", result: await this.getTaskResult({ taskId }, resultSchema, options2) };
          return;
        }
        let pollInterval = task2.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1000;
        await new Promise((resolve24) => setTimeout(resolve24, pollInterval)), options2?.signal?.throwIfAborted();
      }
    } catch (error44) {
      yield {
        type: "error",
        error: error44 instanceof McpError ? error44 : new McpError(ErrorCode.InternalError, String(error44))
      };
    }
  }
  request(request2, resultSchema, options2) {
    let { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options2 ?? {};
    return new Promise((resolve24, reject2) => {
      let earlyReject = (error44) => {
        reject2(error44);
      };
      if (!this._transport) {
        earlyReject(Error("Not connected"));
        return;
      }
      if (this._options?.enforceStrictCapabilities === !0)
        try {
          if (this.assertCapabilityForMethod(request2.method), task)
            this.assertTaskCapability(request2.method);
        } catch (e) {
          earlyReject(e);
          return;
        }
      options2?.signal?.throwIfAborted();
      let messageId = this._requestMessageId++, jsonrpcRequest = {
        ...request2,
        jsonrpc: "2.0",
        id: messageId
      };
      if (options2?.onprogress)
        this._progressHandlers.set(messageId, options2.onprogress), jsonrpcRequest.params = {
          ...request2.params,
          _meta: {
            ...request2.params?._meta || {},
            progressToken: messageId
          }
        };
      if (task)
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          task
        };
      if (relatedTask)
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          _meta: {
            ...jsonrpcRequest.params?._meta || {},
            [RELATED_TASK_META_KEY]: relatedTask
          }
        };
      let cancel = (reason) => {
        this._responseHandlers.delete(messageId), this._progressHandlers.delete(messageId), this._cleanupTimeout(messageId), this._transport?.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: messageId,
            reason: String(reason)
          }
        }, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error45) => this._onerror(Error(`Failed to send cancellation: ${error45}`)));
        let error44 = reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason));
        reject2(error44);
      };
      this._responseHandlers.set(messageId, (response7) => {
        if (options2?.signal?.aborted)
          return;
        if (response7 instanceof Error)
          return reject2(response7);
        try {
          let parseResult = safeParse3(resultSchema, response7.result);
          if (!parseResult.success)
            reject2(parseResult.error);
          else
            resolve24(parseResult.data);
        } catch (error44) {
          reject2(error44);
        }
      }), options2?.signal?.addEventListener("abort", () => {
        cancel(options2?.signal?.reason);
      });
      let timeout = options2?.timeout ?? DEFAULT_REQUEST_TIMEOUT_MSEC, timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout }));
      this._setupTimeout(messageId, timeout, options2?.maxTotalTimeout, timeoutHandler, options2?.resetTimeoutOnProgress ?? !1);
      let relatedTaskId = relatedTask?.taskId;
      if (relatedTaskId) {
        let responseResolver = (response7) => {
          let handler = this._responseHandlers.get(messageId);
          if (handler)
            handler(response7);
          else
            this._onerror(Error(`Response handler missing for side-channeled request ${messageId}`));
        };
        this._requestResolvers.set(messageId, responseResolver), this._enqueueTaskMessage(relatedTaskId, {
          type: "request",
          message: jsonrpcRequest,
          timestamp: Date.now()
        }).catch((error44) => {
          this._cleanupTimeout(messageId), reject2(error44);
        });
      } else
        this._transport.send(jsonrpcRequest, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error44) => {
          this._cleanupTimeout(messageId), reject2(error44);
        });
    });
  }
  async getTask(params, options2) {
    return this.request({ method: "tasks/get", params }, GetTaskResultSchema, options2);
  }
  async getTaskResult(params, resultSchema, options2) {
    return this.request({ method: "tasks/result", params }, resultSchema, options2);
  }
  async listTasks(params, options2) {
    return this.request({ method: "tasks/list", params }, ListTasksResultSchema, options2);
  }
  async cancelTask(params, options2) {
    return this.request({ method: "tasks/cancel", params }, CancelTaskResultSchema, options2);
  }
  async notification(notification, options2) {
    if (!this._transport)
      throw Error("Not connected");
    this.assertNotificationCapability(notification.method);
    let relatedTaskId = options2?.relatedTask?.taskId;
    if (relatedTaskId) {
      let jsonrpcNotification2 = {
        ...notification,
        jsonrpc: "2.0",
        params: {
          ...notification.params,
          _meta: {
            ...notification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options2.relatedTask
          }
        }
      };
      await this._enqueueTaskMessage(relatedTaskId, {
        type: "notification",
        message: jsonrpcNotification2,
        timestamp: Date.now()
      });
      return;
    }
    if ((this._options?.debouncedNotificationMethods ?? []).includes(notification.method) && !notification.params && !options2?.relatedRequestId && !options2?.relatedTask) {
      if (this._pendingDebouncedNotifications.has(notification.method))
        return;
      this._pendingDebouncedNotifications.add(notification.method), Promise.resolve().then(() => {
        if (this._pendingDebouncedNotifications.delete(notification.method), !this._transport)
          return;
        let jsonrpcNotification2 = {
          ...notification,
          jsonrpc: "2.0"
        };
        if (options2?.relatedTask)
          jsonrpcNotification2 = {
            ...jsonrpcNotification2,
            params: {
              ...jsonrpcNotification2.params,
              _meta: {
                ...jsonrpcNotification2.params?._meta || {},
                [RELATED_TASK_META_KEY]: options2.relatedTask
              }
            }
          };
        this._transport?.send(jsonrpcNotification2, options2).catch((error44) => this._onerror(error44));
      });
      return;
    }
    let jsonrpcNotification = {
      ...notification,
      jsonrpc: "2.0"
    };
    if (options2?.relatedTask)
      jsonrpcNotification = {
        ...jsonrpcNotification,
        params: {
          ...jsonrpcNotification.params,
          _meta: {
            ...jsonrpcNotification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options2.relatedTask
          }
        }
      };
    await this._transport.send(jsonrpcNotification, options2);
  }
  setRequestHandler(requestSchema, handler) {
    let method = getMethodLiteral(requestSchema);
    this.assertRequestHandlerCapability(method), this._requestHandlers.set(method, (request2, extra) => {
      let parsed = parseWithCompat(requestSchema, request2);
      return Promise.resolve(handler(parsed, extra));
    });
  }
  removeRequestHandler(method) {
    this._requestHandlers.delete(method);
  }
  assertCanSetRequestHandler(method) {
    if (this._requestHandlers.has(method))
      throw Error(`A request handler for ${method} already exists, which would be overridden`);
  }
  setNotificationHandler(notificationSchema, handler) {
    let method = getMethodLiteral(notificationSchema);
    this._notificationHandlers.set(method, (notification) => {
      let parsed = parseWithCompat(notificationSchema, notification);
      return Promise.resolve(handler(parsed));
    });
  }
  removeNotificationHandler(method) {
    this._notificationHandlers.delete(method);
  }
  _cleanupTaskProgressHandler(taskId) {
    let progressToken = this._taskProgressTokens.get(taskId);
    if (progressToken !== void 0)
      this._progressHandlers.delete(progressToken), this._taskProgressTokens.delete(taskId);
  }
  async _enqueueTaskMessage(taskId, message, sessionId) {
    if (!this._taskStore || !this._taskMessageQueue)
      throw Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
    let maxQueueSize = this._options?.maxTaskQueueSize;
    await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
  }
  async _clearTaskQueue(taskId, sessionId) {
    if (this._taskMessageQueue) {
      let messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
      for (let message of messages)
        if (message.type === "request" && isJSONRPCRequest(message.message)) {
          let requestId = message.message.id, resolver = this._requestResolvers.get(requestId);
          if (resolver)
            resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed")), this._requestResolvers.delete(requestId);
          else
            this._onerror(Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
        }
    }
  }
  async _waitForTaskUpdate(taskId, signal) {
    let interval = this._options?.defaultTaskPollInterval ?? 1000;
    try {
      let task = await this._taskStore?.getTask(taskId);
      if (task?.pollInterval)
        interval = task.pollInterval;
    } catch {}
    return new Promise((resolve24, reject2) => {
      if (signal.aborted) {
        reject2(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
        return;
      }
      let timeoutId = setTimeout(resolve24, interval);
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId), reject2(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
      }, { once: !0 });
    });
  }
  requestTaskStore(request2, sessionId) {
    let taskStore = this._taskStore;
    if (!taskStore)
      throw Error("No task store configured");
    return {
      createTask: async (taskParams) => {
        if (!request2)
          throw Error("No request provided");
        return await taskStore.createTask(taskParams, request2.id, {
          method: request2.method,
          params: request2.params
        }, sessionId);
      },
      getTask: async (taskId) => {
        let task = await taskStore.getTask(taskId, sessionId);
        if (!task)
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        return task;
      },
      storeTaskResult: async (taskId, status, result) => {
        await taskStore.storeTaskResult(taskId, status, result, sessionId);
        let task = await taskStore.getTask(taskId, sessionId);
        if (task) {
          let notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: task
          });
          if (await this.notification(notification), isTerminal(task.status))
            this._cleanupTaskProgressHandler(taskId);
        }
      },
      getTaskResult: (taskId) => {
        return taskStore.getTaskResult(taskId, sessionId);
      },
      updateTaskStatus: async (taskId, status, statusMessage) => {
        let task = await taskStore.getTask(taskId, sessionId);
        if (!task)
          throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
        if (isTerminal(task.status))
          throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
        await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
        let updatedTask = await taskStore.getTask(taskId, sessionId);
        if (updatedTask) {
          let notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: updatedTask
          });
          if (await this.notification(notification), isTerminal(updatedTask.status))
            this._cleanupTaskProgressHandler(taskId);
        }
      },
      listTasks: (cursor) => {
        return taskStore.listTasks(cursor, sessionId);
      }
    };
  }
}

// var: require_invoke_store
var require_invoke_store = __commonJS((exports) => {
  var PROTECTED_KEYS = {
    REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
    X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
    TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
  }, NO_GLOBAL_AWS_LAMBDA = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
  if (!NO_GLOBAL_AWS_LAMBDA)
    globalThis.awslambda = globalThis.awslambda || {};

  class InvokeStoreBase {
    static PROTECTED_KEYS = PROTECTED_KEYS;
    isProtectedKey(key) {
      return Object.values(PROTECTED_KEYS).includes(key);
    }
    getRequestId() {
      return this.get(PROTECTED_KEYS.REQUEST_ID) ?? "-";
    }
    getXRayTraceId() {
      return this.get(PROTECTED_KEYS.X_RAY_TRACE_ID);
    }
    getTenantId() {
      return this.get(PROTECTED_KEYS.TENANT_ID);
    }
  }

  class InvokeStoreSingle extends InvokeStoreBase {
    currentContext;
    getContext() {
      return this.currentContext;
    }
    hasContext() {
      return this.currentContext !== void 0;
    }
    get(key) {
      return this.currentContext?.[key];
    }
    set(key, value) {
      if (this.isProtectedKey(key))
        throw Error(`Cannot modify protected Lambda context field: ${String(key)}`);
      this.currentContext = this.currentContext || {}, this.currentContext[key] = value;
    }
    run(context, fn) {
      return this.currentContext = context, fn();
    }
  }

  class InvokeStoreMulti extends InvokeStoreBase {
    als;
    static async create() {
      let instance = new InvokeStoreMulti, asyncHooks = await import("async_hooks");
      return instance.als = new asyncHooks.AsyncLocalStorage, instance;
    }
    getContext() {
      return this.als.getStore();
    }
    hasContext() {
      return this.als.getStore() !== void 0;
    }
    get(key) {
      return this.als.getStore()?.[key];
    }
    set(key, value) {
      if (this.isProtectedKey(key))
        throw Error(`Cannot modify protected Lambda context field: ${String(key)}`);
      let store = this.als.getStore();
      if (!store)
        throw Error("No context available");
      store[key] = value;
    }
    run(context, fn) {
      return this.als.run(context, fn);
    }
  }
  exports.InvokeStore = void 0;
  (function(InvokeStore) {
    let instance = null;
    async function getInstanceAsync(forceInvokeStoreMulti) {
      if (!instance)
        instance = (async () => {
          let newInstance = forceInvokeStoreMulti === !0 || "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await InvokeStoreMulti.create() : new InvokeStoreSingle;
          if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda?.InvokeStore)
            return globalThis.awslambda.InvokeStore;
          else if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda)
            return globalThis.awslambda.InvokeStore = newInstance, newInstance;
          else
            return newInstance;
        })();
      return instance;
    }
    InvokeStore.getInstanceAsync = getInstanceAsync, InvokeStore._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
      reset: () => {
        if (instance = null, globalThis.awslambda?.InvokeStore)
          delete globalThis.awslambda.InvokeStore;
        globalThis.awslambda = { InvokeStore: void 0 };
      }
    } : void 0;
  })(exports.InvokeStore || (exports.InvokeStore = {}));
  exports.InvokeStoreBase = InvokeStoreBase;
});

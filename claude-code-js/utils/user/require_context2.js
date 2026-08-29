// var: require_context2
var require_context2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ContextAPI = void 0;
  var NoopContextManager_1 = require_NoopContextManager(), global_utils_1 = require_global_utils(), diag_1 = require_diag(), API_NAME = "context", NOOP_CONTEXT_MANAGER = new NoopContextManager_1.NoopContextManager;

  class ContextAPI {
    constructor() {}
    static getInstance() {
      if (!this._instance)
        this._instance = new ContextAPI;
      return this._instance;
    }
    setGlobalContextManager(contextManager) {
      return (0, global_utils_1.registerGlobal)(API_NAME, contextManager, diag_1.DiagAPI.instance());
    }
    active() {
      return this._getContextManager().active();
    }
    with(context3, fn, thisArg, ...args) {
      return this._getContextManager().with(context3, fn, thisArg, ...args);
    }
    bind(context3, target) {
      return this._getContextManager().bind(context3, target);
    }
    _getContextManager() {
      return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_CONTEXT_MANAGER;
    }
    disable() {
      this._getContextManager().disable(), (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
    }
  }
  exports.ContextAPI = ContextAPI;
});

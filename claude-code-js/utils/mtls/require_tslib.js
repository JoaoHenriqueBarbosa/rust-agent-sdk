// var: require_tslib
var require_tslib = __commonJS((exports, module) => {
  var __extends, __assign, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet2, __classPrivateFieldSet2, __classPrivateFieldIn, __createBinding, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension;
  (function(factory2) {
    var root2 = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd)
      define("tslib", ["exports"], function(exports2) {
        factory2(createExporter(root2, createExporter(exports2)));
      });
    else if (typeof module === "object" && typeof exports === "object")
      factory2(createExporter(root2, createExporter(exports)));
    else
      factory2(createExporter(root2));
    function createExporter(exports2, previous) {
      if (exports2 !== root2)
        if (typeof Object.create === "function")
          Object.defineProperty(exports2, "__esModule", { value: !0 });
        else
          exports2.__esModule = !0;
      return function(id, v) {
        return exports2[id] = previous ? previous(id, v) : v;
      };
    }
  })(function(exporter) {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
      d.__proto__ = b;
    } || function(d, b) {
      for (var p in b)
        if (Object.prototype.hasOwnProperty.call(b, p))
          d[p] = b[p];
    };
    __extends = function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
    }, __assign = Object.assign || function(t) {
      for (var s, i2 = 1, n2 = arguments.length;i2 < n2; i2++) {
        s = arguments[i2];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    }, __rest = function(s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var i2 = 0, p = Object.getOwnPropertySymbols(s);i2 < p.length; i2++)
          if (e.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i2]))
            t[p[i2]] = s[p[i2]];
      }
      return t;
    }, __decorate = function(decorators, target, key, desc) {
      var c3 = arguments.length, r = c3 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i2 = decorators.length - 1;i2 >= 0; i2--)
          if (d = decorators[i2])
            r = (c3 < 3 ? d(r) : c3 > 3 ? d(target, key, r) : d(target, key)) || r;
      return c3 > 3 && r && Object.defineProperty(target, key, r), r;
    }, __param = function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    }, __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
      function accept(f) {
        if (f !== void 0 && typeof f !== "function")
          throw TypeError("Function expected");
        return f;
      }
      var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value", target = !descriptorIn && ctor ? contextIn.static ? ctor : ctor.prototype : null, descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {}), _, done = !1;
      for (var i2 = decorators.length - 1;i2 >= 0; i2--) {
        var context = {};
        for (var p in contextIn)
          context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
          context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
          if (done)
            throw TypeError("Cannot add initializers after decoration has completed");
          extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i2])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
          if (result === void 0)
            continue;
          if (result === null || typeof result !== "object")
            throw TypeError("Object expected");
          if (_ = accept(result.get))
            descriptor.get = _;
          if (_ = accept(result.set))
            descriptor.set = _;
          if (_ = accept(result.init))
            initializers.unshift(_);
        } else if (_ = accept(result))
          if (kind === "field")
            initializers.unshift(_);
          else
            descriptor[key] = _;
      }
      if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
      done = !0;
    }, __runInitializers = function(thisArg, initializers, value) {
      var useValue = arguments.length > 2;
      for (var i2 = 0;i2 < initializers.length; i2++)
        value = useValue ? initializers[i2].call(thisArg, value) : initializers[i2].call(thisArg);
      return useValue ? value : void 0;
    }, __propKey = function(x2) {
      return typeof x2 === "symbol" ? x2 : "".concat(x2);
    }, __setFunctionName = function(f, name, prefix) {
      if (typeof name === "symbol")
        name = name.description ? "[".concat(name.description, "]") : "";
      return Object.defineProperty(f, "name", { configurable: !0, value: prefix ? "".concat(prefix, " ", name) : name });
    }, __metadata = function(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
    }, __awaiter = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve8) {
          resolve8(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve8, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve8(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, __generator = function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1)
          throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
      return g.next = verb(0), g.throw = verb(1), g.return = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n2) {
        return function(v) {
          return step([n2, v]);
        };
      }
      function step(op) {
        if (f)
          throw TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _)
          try {
            if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
              return t;
            if (y = 0, t)
              op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                return _.label++, { value: op[1], done: !1 };
              case 5:
                _.label++, y = op[1], op = [0];
                continue;
              case 7:
                op = _.ops.pop(), _.trys.pop();
                continue;
              default:
                if ((t = _.trys, !(t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1], t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2], _.ops.push(op);
                  break;
                }
                if (t[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e], y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: !0 };
      }
    }, __exportStar = function(m, o2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(o2, p))
          __createBinding(o2, m, p);
    }, __createBinding = Object.create ? function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable))
        desc = { enumerable: !0, get: function() {
          return m[k];
        } };
      Object.defineProperty(o2, k2, desc);
    } : function(o2, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o2[k2] = m[k];
    }, __values = function(o2) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o2[s], i2 = 0;
      if (m)
        return m.call(o2);
      if (o2 && typeof o2.length === "number")
        return {
          next: function() {
            if (o2 && i2 >= o2.length)
              o2 = void 0;
            return { value: o2 && o2[i2++], done: !o2 };
          }
        };
      throw TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }, __read = function(o2, n2) {
      var m = typeof Symbol === "function" && o2[Symbol.iterator];
      if (!m)
        return o2;
      var i2 = m.call(o2), r, ar = [], e;
      try {
        while ((n2 === void 0 || n2-- > 0) && !(r = i2.next()).done)
          ar.push(r.value);
      } catch (error41) {
        e = { error: error41 };
      } finally {
        try {
          if (r && !r.done && (m = i2.return))
            m.call(i2);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    }, __spread = function() {
      for (var ar = [], i2 = 0;i2 < arguments.length; i2++)
        ar = ar.concat(__read(arguments[i2]));
      return ar;
    }, __spreadArrays = function() {
      for (var s = 0, i2 = 0, il = arguments.length;i2 < il; i2++)
        s += arguments[i2].length;
      for (var r = Array(s), k = 0, i2 = 0;i2 < il; i2++)
        for (var a2 = arguments[i2], j2 = 0, jl = a2.length;j2 < jl; j2++, k++)
          r[k] = a2[j2];
      return r;
    }, __spreadArray = function(to, from, pack) {
      if (pack || arguments.length === 2) {
        for (var i2 = 0, l = from.length, ar;i2 < l; i2++)
          if (ar || !(i2 in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i2);
            ar[i2] = from[i2];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    }, __await = function(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    }, __asyncGenerator = function(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i2, q = [];
      return i2 = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i2[Symbol.asyncIterator] = function() {
        return this;
      }, i2;
      function awaitReturn(f) {
        return function(v) {
          return Promise.resolve(v).then(f, reject);
        };
      }
      function verb(n2, f) {
        if (g[n2]) {
          if (i2[n2] = function(v) {
            return new Promise(function(a2, b) {
              q.push([n2, v, a2, b]) > 1 || resume(n2, v);
            });
          }, f)
            i2[n2] = f(i2[n2]);
        }
      }
      function resume(n2, v) {
        try {
          step(g[n2](v));
        } catch (e) {
          settle2(q[0][3], e);
        }
      }
      function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle2(q[0][2], r);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject(value) {
        resume("throw", value);
      }
      function settle2(f, v) {
        if (f(v), q.shift(), q.length)
          resume(q[0][0], q[0][1]);
      }
    }, __asyncDelegator = function(o2) {
      var i2, p;
      return i2 = {}, verb("next"), verb("throw", function(e) {
        throw e;
      }), verb("return"), i2[Symbol.iterator] = function() {
        return this;
      }, i2;
      function verb(n2, f) {
        i2[n2] = o2[n2] ? function(v) {
          return (p = !p) ? { value: __await(o2[n2](v)), done: !1 } : f ? f(v) : v;
        } : f;
      }
    }, __asyncValues = function(o2) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var m = o2[Symbol.asyncIterator], i2;
      return m ? m.call(o2) : (o2 = typeof __values === "function" ? __values(o2) : o2[Symbol.iterator](), i2 = {}, verb("next"), verb("throw"), verb("return"), i2[Symbol.asyncIterator] = function() {
        return this;
      }, i2);
      function verb(n2) {
        i2[n2] = o2[n2] && function(v) {
          return new Promise(function(resolve8, reject) {
            v = o2[n2](v), settle2(resolve8, reject, v.done, v.value);
          });
        };
      }
      function settle2(resolve8, reject, d, v) {
        Promise.resolve(v).then(function(v2) {
          resolve8({ value: v2, done: d });
        }, reject);
      }
    }, __makeTemplateObject = function(cooked, raw) {
      if (Object.defineProperty)
        Object.defineProperty(cooked, "raw", { value: raw });
      else
        cooked.raw = raw;
      return cooked;
    };
    var __setModuleDefault = Object.create ? function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: !0, value: v });
    } : function(o2, v) {
      o2.default = v;
    }, ownKeys = function(o2) {
      return ownKeys = Object.getOwnPropertyNames || function(o3) {
        var ar = [];
        for (var k in o3)
          if (Object.prototype.hasOwnProperty.call(o3, k))
            ar[ar.length] = k;
        return ar;
      }, ownKeys(o2);
    };
    __importStar = function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i2 = 0;i2 < k.length; i2++)
          if (k[i2] !== "default")
            __createBinding(result, mod, k[i2]);
      }
      return __setModuleDefault(result, mod), result;
    }, __importDefault = function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, __classPrivateFieldGet2 = function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }, __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    }, __classPrivateFieldIn = function(state, receiver) {
      if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
        throw TypeError("Cannot use 'in' operator on non-object");
      return typeof state === "function" ? receiver === state : state.has(receiver);
    }, __addDisposableResource = function(env4, value, async) {
      if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function")
          throw TypeError("Object expected.");
        var dispose, inner;
        if (async) {
          if (!Symbol.asyncDispose)
            throw TypeError("Symbol.asyncDispose is not defined.");
          dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
          if (!Symbol.dispose)
            throw TypeError("Symbol.dispose is not defined.");
          if (dispose = value[Symbol.dispose], async)
            inner = dispose;
        }
        if (typeof dispose !== "function")
          throw TypeError("Object not disposable.");
        if (inner)
          dispose = function() {
            try {
              inner.call(this);
            } catch (e) {
              return Promise.reject(e);
            }
          };
        env4.stack.push({ value, dispose, async });
      } else if (async)
        env4.stack.push({ async: !0 });
      return value;
    };
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
      var e = Error(message);
      return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
    };
    __disposeResources = function(env4) {
      function fail(e) {
        env4.error = env4.hasError ? new _SuppressedError(e, env4.error, "An error was suppressed during disposal.") : e, env4.hasError = !0;
      }
      var r, s = 0;
      function next() {
        while (r = env4.stack.pop())
          try {
            if (!r.async && s === 1)
              return s = 0, env4.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  return fail(e), next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        if (s === 1)
          return env4.hasError ? Promise.reject(env4.error) : Promise.resolve();
        if (env4.hasError)
          throw env4.error;
      }
      return next();
    }, __rewriteRelativeImportExtension = function(path9, preserveJsx) {
      if (typeof path9 === "string" && /^\.\.?\//.test(path9))
        return path9.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
        });
      return path9;
    }, exporter("__extends", __extends), exporter("__assign", __assign), exporter("__rest", __rest), exporter("__decorate", __decorate), exporter("__param", __param), exporter("__esDecorate", __esDecorate), exporter("__runInitializers", __runInitializers), exporter("__propKey", __propKey), exporter("__setFunctionName", __setFunctionName), exporter("__metadata", __metadata), exporter("__awaiter", __awaiter), exporter("__generator", __generator), exporter("__exportStar", __exportStar), exporter("__createBinding", __createBinding), exporter("__values", __values), exporter("__read", __read), exporter("__spread", __spread), exporter("__spreadArrays", __spreadArrays), exporter("__spreadArray", __spreadArray), exporter("__await", __await), exporter("__asyncGenerator", __asyncGenerator), exporter("__asyncDelegator", __asyncDelegator), exporter("__asyncValues", __asyncValues), exporter("__makeTemplateObject", __makeTemplateObject), exporter("__importStar", __importStar), exporter("__importDefault", __importDefault), exporter("__classPrivateFieldGet", __classPrivateFieldGet2), exporter("__classPrivateFieldSet", __classPrivateFieldSet2), exporter("__classPrivateFieldIn", __classPrivateFieldIn), exporter("__addDisposableResource", __addDisposableResource), exporter("__disposeResources", __disposeResources), exporter("__rewriteRelativeImportExtension", __rewriteRelativeImportExtension);
  });
});

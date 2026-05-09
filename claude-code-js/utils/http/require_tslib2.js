// var: require_tslib2
var require_tslib2 = __commonJS((exports, module) => {
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  var __extends2, __assign2, __rest2, __decorate2, __param2, __metadata2, __awaiter2, __generator2, __exportStar2, __values2, __read2, __spread2, __spreadArrays2, __await2, __asyncGenerator2, __asyncDelegator2, __asyncValues2, __makeTemplateObject2, __importStar2, __importDefault2, __classPrivateFieldGet3, __classPrivateFieldSet3, __createBinding2;
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
      return function(id, v2) {
        return exports2[id] = previous ? previous(id, v2) : v2;
      };
    }
  })(function(exporter) {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
      d.__proto__ = b;
    } || function(d, b) {
      for (var p4 in b)
        if (b.hasOwnProperty(p4))
          d[p4] = b[p4];
    };
    __extends2 = function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
    }, __assign2 = Object.assign || function(t2) {
      for (var s2, i4 = 1, n5 = arguments.length;i4 < n5; i4++) {
        s2 = arguments[i4];
        for (var p4 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p4))
            t2[p4] = s2[p4];
      }
      return t2;
    }, __rest2 = function(s2, e) {
      var t2 = {};
      for (var p4 in s2)
        if (Object.prototype.hasOwnProperty.call(s2, p4) && e.indexOf(p4) < 0)
          t2[p4] = s2[p4];
      if (s2 != null && typeof Object.getOwnPropertySymbols === "function") {
        for (var i4 = 0, p4 = Object.getOwnPropertySymbols(s2);i4 < p4.length; i4++)
          if (e.indexOf(p4[i4]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p4[i4]))
            t2[p4[i4]] = s2[p4[i4]];
      }
      return t2;
    }, __decorate2 = function(decorators, target, key, desc) {
      var c3 = arguments.length, r4 = c3 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r4 = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i4 = decorators.length - 1;i4 >= 0; i4--)
          if (d = decorators[i4])
            r4 = (c3 < 3 ? d(r4) : c3 > 3 ? d(target, key, r4) : d(target, key)) || r4;
      return c3 > 3 && r4 && Object.defineProperty(target, key, r4), r4;
    }, __param2 = function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    }, __metadata2 = function(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(metadataKey, metadataValue);
    }, __awaiter2 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve9) {
          resolve9(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve9, reject) {
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
          result.done ? resolve9(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }, __generator2 = function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t2[0] & 1)
          throw t2[1];
        return t2[1];
      }, trys: [], ops: [] }, f, y2, t2, g;
      return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n5) {
        return function(v2) {
          return step([n5, v2]);
        };
      }
      function step(op) {
        if (f)
          throw TypeError("Generator is already executing.");
        while (_)
          try {
            if (f = 1, y2 && (t2 = op[0] & 2 ? y2.return : op[0] ? y2.throw || ((t2 = y2.return) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done)
              return t2;
            if (y2 = 0, t2)
              op = [op[0] & 2, t2.value];
            switch (op[0]) {
              case 0:
              case 1:
                t2 = op;
                break;
              case 4:
                return _.label++, { value: op[1], done: !1 };
              case 5:
                _.label++, y2 = op[1], op = [0];
                continue;
              case 7:
                op = _.ops.pop(), _.trys.pop();
                continue;
              default:
                if ((t2 = _.trys, !(t2 = t2.length > 0 && t2[t2.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t2[1]) {
                  _.label = t2[1], t2 = op;
                  break;
                }
                if (t2 && _.label < t2[2]) {
                  _.label = t2[2], _.ops.push(op);
                  break;
                }
                if (t2[2])
                  _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e], y2 = 0;
          } finally {
            f = t2 = 0;
          }
        if (op[0] & 5)
          throw op[1];
        return { value: op[0] ? op[1] : void 0, done: !0 };
      }
    }, __createBinding2 = function(o5, m4, k3, k22) {
      if (k22 === void 0)
        k22 = k3;
      o5[k22] = m4[k3];
    }, __exportStar2 = function(m4, exports2) {
      for (var p4 in m4)
        if (p4 !== "default" && !exports2.hasOwnProperty(p4))
          exports2[p4] = m4[p4];
    }, __values2 = function(o5) {
      var s2 = typeof Symbol === "function" && Symbol.iterator, m4 = s2 && o5[s2], i4 = 0;
      if (m4)
        return m4.call(o5);
      if (o5 && typeof o5.length === "number")
        return {
          next: function() {
            if (o5 && i4 >= o5.length)
              o5 = void 0;
            return { value: o5 && o5[i4++], done: !o5 };
          }
        };
      throw TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }, __read2 = function(o5, n5) {
      var m4 = typeof Symbol === "function" && o5[Symbol.iterator];
      if (!m4)
        return o5;
      var i4 = m4.call(o5), r4, ar = [], e;
      try {
        while ((n5 === void 0 || n5-- > 0) && !(r4 = i4.next()).done)
          ar.push(r4.value);
      } catch (error41) {
        e = { error: error41 };
      } finally {
        try {
          if (r4 && !r4.done && (m4 = i4.return))
            m4.call(i4);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return ar;
    }, __spread2 = function() {
      for (var ar = [], i4 = 0;i4 < arguments.length; i4++)
        ar = ar.concat(__read2(arguments[i4]));
      return ar;
    }, __spreadArrays2 = function() {
      for (var s2 = 0, i4 = 0, il = arguments.length;i4 < il; i4++)
        s2 += arguments[i4].length;
      for (var r4 = Array(s2), k3 = 0, i4 = 0;i4 < il; i4++)
        for (var a2 = arguments[i4], j4 = 0, jl = a2.length;j4 < jl; j4++, k3++)
          r4[k3] = a2[j4];
      return r4;
    }, __await2 = function(v2) {
      return this instanceof __await2 ? (this.v = v2, this) : new __await2(v2);
    }, __asyncGenerator2 = function(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i4, q4 = [];
      return i4 = {}, verb("next"), verb("throw"), verb("return"), i4[Symbol.asyncIterator] = function() {
        return this;
      }, i4;
      function verb(n5) {
        if (g[n5])
          i4[n5] = function(v2) {
            return new Promise(function(a2, b) {
              q4.push([n5, v2, a2, b]) > 1 || resume(n5, v2);
            });
          };
      }
      function resume(n5, v2) {
        try {
          step(g[n5](v2));
        } catch (e) {
          settle2(q4[0][3], e);
        }
      }
      function step(r4) {
        r4.value instanceof __await2 ? Promise.resolve(r4.value.v).then(fulfill, reject) : settle2(q4[0][2], r4);
      }
      function fulfill(value) {
        resume("next", value);
      }
      function reject(value) {
        resume("throw", value);
      }
      function settle2(f, v2) {
        if (f(v2), q4.shift(), q4.length)
          resume(q4[0][0], q4[0][1]);
      }
    }, __asyncDelegator2 = function(o5) {
      var i4, p4;
      return i4 = {}, verb("next"), verb("throw", function(e) {
        throw e;
      }), verb("return"), i4[Symbol.iterator] = function() {
        return this;
      }, i4;
      function verb(n5, f) {
        i4[n5] = o5[n5] ? function(v2) {
          return (p4 = !p4) ? { value: __await2(o5[n5](v2)), done: n5 === "return" } : f ? f(v2) : v2;
        } : f;
      }
    }, __asyncValues2 = function(o5) {
      if (!Symbol.asyncIterator)
        throw TypeError("Symbol.asyncIterator is not defined.");
      var m4 = o5[Symbol.asyncIterator], i4;
      return m4 ? m4.call(o5) : (o5 = typeof __values2 === "function" ? __values2(o5) : o5[Symbol.iterator](), i4 = {}, verb("next"), verb("throw"), verb("return"), i4[Symbol.asyncIterator] = function() {
        return this;
      }, i4);
      function verb(n5) {
        i4[n5] = o5[n5] && function(v2) {
          return new Promise(function(resolve9, reject) {
            v2 = o5[n5](v2), settle2(resolve9, reject, v2.done, v2.value);
          });
        };
      }
      function settle2(resolve9, reject, d, v2) {
        Promise.resolve(v2).then(function(v3) {
          resolve9({ value: v3, done: d });
        }, reject);
      }
    }, __makeTemplateObject2 = function(cooked, raw) {
      if (Object.defineProperty)
        Object.defineProperty(cooked, "raw", { value: raw });
      else
        cooked.raw = raw;
      return cooked;
    }, __importStar2 = function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k3 in mod)
          if (Object.hasOwnProperty.call(mod, k3))
            result[k3] = mod[k3];
      }
      return result.default = mod, result;
    }, __importDefault2 = function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    }, __classPrivateFieldGet3 = function(receiver, privateMap) {
      if (!privateMap.has(receiver))
        throw TypeError("attempted to get private field on non-instance");
      return privateMap.get(receiver);
    }, __classPrivateFieldSet3 = function(receiver, privateMap, value) {
      if (!privateMap.has(receiver))
        throw TypeError("attempted to set private field on non-instance");
      return privateMap.set(receiver, value), value;
    }, exporter("__extends", __extends2), exporter("__assign", __assign2), exporter("__rest", __rest2), exporter("__decorate", __decorate2), exporter("__param", __param2), exporter("__metadata", __metadata2), exporter("__awaiter", __awaiter2), exporter("__generator", __generator2), exporter("__exportStar", __exportStar2), exporter("__createBinding", __createBinding2), exporter("__values", __values2), exporter("__read", __read2), exporter("__spread", __spread2), exporter("__spreadArrays", __spreadArrays2), exporter("__await", __await2), exporter("__asyncGenerator", __asyncGenerator2), exporter("__asyncDelegator", __asyncDelegator2), exporter("__asyncValues", __asyncValues2), exporter("__makeTemplateObject", __makeTemplateObject2), exporter("__importStar", __importStar2), exporter("__importDefault", __importDefault2), exporter("__classPrivateFieldGet", __classPrivateFieldGet3), exporter("__classPrivateFieldSet", __classPrivateFieldSet3);
  });
});

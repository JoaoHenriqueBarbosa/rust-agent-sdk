// Shared module state and imports
// Original: src/utils/plugins/gitAvailability.ts
var checkGitAvailable;

// node_modules/@anthropic-ai/sandbox-runtime/dist/utils/debug.js

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/parent-proxy.js
import { BlockList, connect as netConnect, isIP } from "net";
import { connect as tlsConnect } from "tls";
import { URL as URL2 } from "url";

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/http-proxy.js
import { Agent, createServer } from "http";
import { request as httpRequest10 } from "http";
import { request as httpsRequest } from "https";
import { connect } from "net";
import { URL as URL3 } from "url";

// node_modules/@pondwader/socks5-server/dist/index.mjs
import net2 from "net";
import net from "net";
var Socks5ConnectionCommand, Socks5ConnectionStatus, Socks5Connection = class {
  constructor(server, socket) {
    this.errorHandler = () => {}, this.metadata = {}, this.socket = socket, this.server = server, socket.on("error", this.errorHandler), socket.pause(), this.handleGreeting();
  }
  readBytes(len) {
    return new Promise((resolve15) => {
      let buf = Buffer.allocUnsafe(len), offset = 0, dataListener = (chunk) => {
        let readAmount = Math.min(chunk.length, len - offset);
        if (chunk.copy(buf, offset, 0, readAmount), offset += readAmount, offset < len)
          return;
        this.socket.removeListener("data", dataListener), this.socket.push(chunk.subarray(readAmount)), resolve15(buf), this.socket.pause();
      };
      this.socket.on("data", dataListener), this.socket.resume();
    });
  }
  async handleGreeting() {
    if ((await this.readBytes(1)).readUInt8() !== 5)
      return this.socket.destroy();
    let authMethodsAmount = (await this.readBytes(1)).readUInt8();
    if (authMethodsAmount > 128 || authMethodsAmount === 0)
      return this.socket.destroy();
    let authMethods = await this.readBytes(authMethodsAmount), authMethodByteCode = this.server.authHandler ? 2 : 0;
    if (!authMethods.includes(authMethodByteCode))
      return this.socket.write(Buffer.from([
        5,
        255
      ])), this.socket.destroy();
    if (this.socket.write(Buffer.from([
      5,
      authMethodByteCode
    ])), this.server.authHandler)
      this.handleUserPassword();
    else
      this.handleConnectionRequest();
  }
  async handleUserPassword() {
    await this.readBytes(1);
    let usernameLength = (await this.readBytes(1)).readUint8(), username = (await this.readBytes(usernameLength)).toString(), passwordLength = (await this.readBytes(1)).readUint8(), password = (await this.readBytes(passwordLength)).toString();
    this.username = username, this.password = password;
    let calledBack = !1, acceptCallback = () => {
      if (calledBack)
        return;
      calledBack = !0, this.socket.write(Buffer.from([
        1,
        0
      ])), this.handleConnectionRequest();
    }, denyCallback = () => {
      if (calledBack)
        return;
      calledBack = !0, this.socket.write(Buffer.from([
        1,
        1
      ])), this.socket.destroy();
    }, resp = await this.server.authHandler(this, acceptCallback, denyCallback);
    if (resp === !0)
      acceptCallback();
    else if (resp === !1)
      denyCallback();
  }
  async handleConnectionRequest() {
    await this.readBytes(1);
    let commandByte = (await this.readBytes(1))[0], command12 = Socks5ConnectionCommand[commandByte];
    if (!command12)
      return this.socket.destroy();
    this.command = command12, await this.readBytes(1);
    let addrType = (await this.readBytes(1)).readUInt8(), address = "";
    switch (addrType) {
      case 1:
        address = (await this.readBytes(4)).join(".");
        break;
      case 3:
        let hostLength = (await this.readBytes(1)).readUInt8();
        address = (await this.readBytes(hostLength)).toString();
        break;
      case 4:
        let bytes = await this.readBytes(16);
        for (let i4 = 0;i4 < 16; i4++) {
          if (i4 % 2 === 0 && i4 > 0)
            address += ":";
          address += `${bytes[i4] < 16 ? "0" : ""}${bytes[i4].toString(16)}`;
        }
        break;
      default:
        this.socket.destroy();
        return;
    }
    let port = (await this.readBytes(2)).readUInt16BE();
    if (!this.server.supportedCommands.has(command12))
      return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
    this.destAddress = address, this.destPort = port;
    let calledBack = !1, acceptCallback = () => {
      if (calledBack)
        return;
      calledBack = !0, this.connect();
    };
    if (!this.server.rulesetValidator)
      return acceptCallback();
    let denyCallback = () => {
      if (calledBack)
        return;
      calledBack = !0, this.socket.write(Buffer.from([
        5,
        2,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ])), this.socket.destroy();
    }, resp = await this.server.rulesetValidator(this, acceptCallback, denyCallback);
    if (resp === !0)
      acceptCallback();
    else if (resp === !1)
      denyCallback();
  }
  connect() {
    this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (status) => {
      if (Socks5ConnectionStatus[status] === void 0)
        throw Error(`"${status}" is not a valid status.`);
      if (this.socket.write(Buffer.from([
        5,
        Socks5ConnectionStatus[status],
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ])), status !== "REQUEST_GRANTED")
        this.socket.destroy();
    }), this.socket.resume();
  }
}, Socks5Server = class {
  constructor() {
    this.supportedCommands = /* @__PURE__ */ new Set(["connect"]), this.connectionHandler = connectionHandler_default, this.server = net2.createServer((socket) => {
      socket.setNoDelay(), this._handleConnection(socket);
    });
  }
  listen(...args) {
    return this.server.listen(...args), this;
  }
  close(callback) {
    return this.server.close(callback), this;
  }
  setAuthHandler(handler) {
    return this.authHandler = handler, this;
  }
  disableAuthHandler() {
    return this.authHandler = void 0, this;
  }
  setRulesetValidator(handler) {
    return this.rulesetValidator = handler, this;
  }
  disableRulesetValidator() {
    return this.rulesetValidator = void 0, this;
  }
  setConnectionHandler(handler) {
    return this.connectionHandler = handler, this;
  }
  useDefaultConnectionHandler() {
    return this.connectionHandler = connectionHandler_default, this;
  }
  _handleConnection(socket) {
    return new Socks5Connection(this, socket), this;
  }
};

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/socks-proxy.js

// node_modules/@anthropic-ai/sandbox-runtime/dist/utils/which.js
import { spawnSync as spawnSync3 } from "child_process";

// node_modules/@anthropic-ai/sandbox-runtime/dist/utils/platform.js
import * as fs9 from "fs";

// node_modules/shell-quote/quote.js

// node_modules/shell-quote/parse.js
  module.exports = function(s2, env5, opts) {
    var mapped = parseInternal(s2, env5, opts);
    if (typeof env5 !== "function")
      return mapped;
    return mapped.reduce(function(acc, s3) {
      if (typeof s3 === "object")
        return acc.concat(s3);
      var xs = s3.split(RegExp("(" + TOKEN + ".*?" + TOKEN + ")", "g"));
      if (xs.length === 1)
        return acc.concat(xs[0]);
      return acc.concat(xs.filter(Boolean).map(function(x3) {
        if (startsWithToken.test(x3))
          return JSON.parse(x3.split(TOKEN)[1]);
        return x3;
      }));
    }, []);
  };
});

// node_modules/shell-quote/index.js

// node_modules/@anthropic-ai/sandbox-runtime/dist/utils/ripgrep.js
import { spawn as spawn3 } from "child_process";
import { text } from "stream/consumers";

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/sandbox-utils.js
import { homedir as homedir14 } from "os";
import * as path13 from "path";
import * as fs10 from "fs";
var DANGEROUS_FILES, DANGEROUS_DIRECTORIES;

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/generate-seccomp-filter.js
import { join as join31, dirname as dirname19 } from "path";
import { fileURLToPath as fileURLToPath5 } from "url";
import * as fs11 from "fs";
import { execSync } from "child_process";
import { homedir as homedir15 } from "os";
var applySeccompPathCache, cachedGlobalNpmPaths = null;

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/linux-sandbox-utils.js
import { randomBytes as randomBytes3 } from "crypto";
import * as fs12 from "fs";
import { spawn as spawn4 } from "child_process";
import { tmpdir as tmpdir2 } from "os";
import path14, { join as join32 } from "path";
var import_shell_quote, DEFAULT_MANDATORY_DENY_SEARCH_DEPTH = 3, bwrapMountPoints, activeSandboxCount = 0, exitHandlerRegistered = !1;

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/macos-sandbox-utils.js
import { spawn as spawn5 } from "child_process";
import * as path15 from "path";
var import_shell_quote2, sessionSuffix;

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/sandbox-violation-store.js

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/sandbox-manager.js
import * as fs13 from "fs";
import { isIP as isIP2 } from "net";
import { EOL as EOL2 } from "os";
var config8, httpProxyServer, socksProxyServer, managerContext, initializationPromise, cleanupRegistered = !1, logMonitorShutdown, parentProxy, sandboxViolationStore, SandboxManager;

// node_modules/zod/v3/helpers/util.js
var util10, objectUtil, ZodParsedType, getParsedType2 = (data) => {
  switch (typeof data) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data))
        return ZodParsedType.array;
      if (data === null)
        return ZodParsedType.null;
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function")
        return ZodParsedType.promise;
      if (typeof Map < "u" && data instanceof Map)
        return ZodParsedType.map;
      if (typeof Set < "u" && data instanceof Set)
        return ZodParsedType.set;
      if (typeof Date < "u" && data instanceof Date)
        return ZodParsedType.date;
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode2, quotelessJson = (obj) => {
  return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:");
}, ZodError2;

// node_modules/zod/v3/locales/en.js

// node_modules/zod/v3/errors.js
var overrideErrorMap;

// node_modules/zod/v3/helpers/parseUtil.js


// node_modules/zod/v3/helpers/typeAliases.js

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;

// node_modules/zod/v3/types.js


// node_modules/zod/v3/external.js
__export(exports_external2, {
  void: () => voidType,
  util: () => util10,
  unknown: () => unknownType,
  union: () => unionType,
  undefined: () => undefinedType,
  tuple: () => tupleType,
  transformer: () => effectsType,
  symbol: () => symbolType,
  string: () => stringType,
  strictObject: () => strictObjectType,
  setErrorMap: () => setErrorMap2,
  set: () => setType,
  record: () => recordType,
  quotelessJson: () => quotelessJson,
  promise: () => promiseType,
  preprocess: () => preprocessType,
  pipeline: () => pipelineType,
  ostring: () => ostring,
  optional: () => optionalType,
  onumber: () => onumber,
  oboolean: () => oboolean,
  objectUtil: () => objectUtil,
  object: () => objectType,
  number: () => numberType,
  nullable: () => nullableType,
  null: () => nullType,
  never: () => neverType,
  nativeEnum: () => nativeEnumType,
  nan: () => nanType,
  map: () => mapType,
  makeIssue: () => makeIssue,
  literal: () => literalType,
  lazy: () => lazyType,
  late: () => late,
  isValid: () => isValid,
  isDirty: () => isDirty,
  isAsync: () => isAsync,
  isAborted: () => isAborted,
  intersection: () => intersectionType,
  instanceof: () => instanceOfType,
  getParsedType: () => getParsedType2,
  getErrorMap: () => getErrorMap2,
  function: () => functionType,
  enum: () => enumType,
  effect: () => effectsType,
  discriminatedUnion: () => discriminatedUnionType,
  defaultErrorMap: () => en_default2,
  datetimeRegex: () => datetimeRegex,
  date: () => dateType,
  custom: () => custom3,
  coerce: () => coerce2,
  boolean: () => booleanType,
  bigint: () => bigIntType,
  array: () => arrayType,
  any: () => anyType,
  addIssueToContext: () => addIssueToContext,
  ZodVoid: () => ZodVoid2,
  ZodUnknown: () => ZodUnknown2,
  ZodUnion: () => ZodUnion2,
  ZodUndefined: () => ZodUndefined2,
  ZodType: () => ZodType2,
  ZodTuple: () => ZodTuple2,
  ZodTransformer: () => ZodEffects,
  ZodSymbol: () => ZodSymbol2,
  ZodString: () => ZodString2,
  ZodSet: () => ZodSet2,
  ZodSchema: () => ZodType2,
  ZodRecord: () => ZodRecord2,
  ZodReadonly: () => ZodReadonly2,
  ZodPromise: () => ZodPromise2,
  ZodPipeline: () => ZodPipeline,
  ZodParsedType: () => ZodParsedType,
  ZodOptional: () => ZodOptional2,
  ZodObject: () => ZodObject2,
  ZodNumber: () => ZodNumber2,
  ZodNullable: () => ZodNullable2,
  ZodNull: () => ZodNull2,
  ZodNever: () => ZodNever2,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNaN: () => ZodNaN2,
  ZodMap: () => ZodMap2,
  ZodLiteral: () => ZodLiteral2,
  ZodLazy: () => ZodLazy2,
  ZodIssueCode: () => ZodIssueCode2,
  ZodIntersection: () => ZodIntersection2,
  ZodFunction: () => ZodFunction,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodError: () => ZodError2,
  ZodEnum: () => ZodEnum2,
  ZodEffects: () => ZodEffects,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion2,
  ZodDefault: () => ZodDefault2,
  ZodDate: () => ZodDate2,
  ZodCatch: () => ZodCatch2,
  ZodBranded: () => ZodBranded,
  ZodBoolean: () => ZodBoolean2,
  ZodBigInt: () => ZodBigInt2,
  ZodArray: () => ZodArray2,
  ZodAny: () => ZodAny2,
  Schema: () => ZodType2,
  ParseStatus: () => ParseStatus,
  OK: () => OK,
  NEVER: () => NEVER2,
  INVALID: () => INVALID,
  EMPTY_PATH: () => EMPTY_PATH,
  DIRTY: () => DIRTY,
  BRAND: () => BRAND
});

// node_modules/zod/index.js

// node_modules/@anthropic-ai/sandbox-runtime/dist/sandbox/sandbox-config.js
var domainPatternSchema, filesystemPathSchema, MitmProxyConfigSchema, ParentProxyConfigSchema, NetworkConfigSchema, FilesystemConfigSchema, IgnoreViolationsConfigSchema, RipgrepConfigSchema, SeccompConfigSchema, SandboxRuntimeConfigSchema;

// node_modules/@anthropic-ai/sandbox-runtime/dist/index.js

// node_modules/lodash-es/_baseFindIndex.js
var _baseFindIndex_default;

// node_modules/lodash-es/_baseIsNaN.js
var _baseIsNaN_default;

// node_modules/lodash-es/_strictIndexOf.js
var _strictIndexOf_default;

// node_modules/lodash-es/_baseIndexOf.js
var _baseIndexOf_default;

// node_modules/lodash-es/_arrayIncludes.js
var _arrayIncludes_default;

// node_modules/lodash-es/_isFlattenable.js
var spreadableSymbol, _isFlattenable_default;

// node_modules/lodash-es/_baseFlatten.js
var _baseFlatten_default;

// node_modules/lodash-es/flatten.js
var flatten_default;

// node_modules/lodash-es/_flatRest.js
var _flatRest_default;

// node_modules/lodash-es/_baseSlice.js
var _baseSlice_default;

// node_modules/lodash-es/_castSlice.js
var _castSlice_default;

// node_modules/lodash-es/_hasUnicode.js

// node_modules/lodash-es/_asciiToArray.js
var _asciiToArray_default;

// node_modules/lodash-es/_unicodeToArray.js

// node_modules/lodash-es/_stringToArray.js
var _stringToArray_default;

// node_modules/lodash-es/_createCaseFirst.js
var _createCaseFirst_default;

// node_modules/lodash-es/upperFirst.js
var upperFirst, upperFirst_default;

// node_modules/lodash-es/capitalize.js
var capitalize_default;

// node_modules/lodash-es/_arrayAggregator.js
var _arrayAggregator_default;

// node_modules/lodash-es/_baseForOwn.js
var _baseForOwn_default;

// node_modules/lodash-es/_createBaseEach.js
var _createBaseEach_default;

// node_modules/lodash-es/_baseEach.js
var baseEach, _baseEach_default;

// node_modules/lodash-es/_baseAggregator.js
var _baseAggregator_default;

// node_modules/lodash-es/_createAggregator.js
var _createAggregator_default;

// node_modules/lodash-es/_arrayIncludesWith.js
var _arrayIncludesWith_default;

// node_modules/lodash-es/_baseFilter.js
var _baseFilter_default;

// node_modules/lodash-es/_baseValues.js
var _baseValues_default;

// node_modules/lodash-es/values.js
var values_default;

// node_modules/lodash-es/_parent.js
var _parent_default;

// node_modules/lodash-es/mapValues.js
var mapValues_default;

// node_modules/lodash-es/negate.js

// node_modules/lodash-es/_baseUnset.js
var objectProto17, hasOwnProperty15, _baseUnset_default;

// node_modules/lodash-es/_customOmitClone.js
var _customOmitClone_default;

// node_modules/lodash-es/omit.js

// node_modules/lodash-es/partition.js
var partition2, partition_default;

// node_modules/lodash-es/_baseRandom.js
var nativeFloor, nativeRandom, _baseRandom_default;

// node_modules/lodash-es/reject.js
var reject_default;

// node_modules/lodash-es/_arraySample.js
var _arraySample_default;

// node_modules/lodash-es/_baseSample.js
var _baseSample_default;

// node_modules/lodash-es/sample.js
var sample_default;

// node_modules/lodash-es/setWith.js
var setWith_default;

// node_modules/lodash-es/_createSet.js

// node_modules/lodash-es/_baseUniq.js

// node_modules/lodash-es/uniqBy.js
var uniqBy_default;

// node_modules/lodash-es/_baseZipObject.js
var _baseZipObject_default;

// node_modules/lodash-es/zipObject.js
var zipObject_default;

// node_modules/lodash-es/lodash.js


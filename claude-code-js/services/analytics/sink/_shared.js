// Shared module state and imports
// Original: src/services/analytics/sink.ts

// node_modules/chalk/source/vendor/ansi-styles/index.js

// node_modules/chalk/source/vendor/supports-color/index.js
import process3 from "process";
import os from "os";
import tty from "tty";
var env, flagForceColor, supportsColor, supports_color_default;

// node_modules/chalk/source/utilities.js

// node_modules/chalk/source/index.js
var stdoutColor, stderrColor, GENERATOR, STYLER, IS_EMPTY, levelMapping, styles2, applyOptions = (object2, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3))
    throw Error("The `level` option should be an integer from 0 to 3");
  let colorLevel = stdoutColor ? stdoutColor.level : 0;
  object2.level = options.level === void 0 ? colorLevel : options.level;
}, chalkFactory = (options) => {
  let chalk = (...strings) => strings.join(" ");
  return applyOptions(chalk, options), Object.setPrototypeOf(chalk, createChalk.prototype), chalk;
}, getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m")
      return ansi_styles_default[type].ansi16m(...arguments_);
    if (level === "ansi256")
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex")
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  return ansi_styles_default[type][model](...arguments_);
}, usedModels, proto, createStyler = (open2, close, parent) => {
  let openAll, closeAll;
  if (parent === void 0)
    openAll = open2, closeAll = close;
  else
    openAll = parent.openAll + open2, closeAll = close + parent.closeAll;
  return {
    open: open2,
    close,
    openAll,
    closeAll,
    parent
  };
}, createBuilder = (self2, _styler, _isEmpty) => {
  let builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  return Object.setPrototypeOf(builder, proto), builder[GENERATOR] = self2, builder[STYLER] = _styler, builder[IS_EMPTY] = _isEmpty, builder;
}, applyStyle = (self2, string4) => {
  if (self2.level <= 0 || !string4)
    return self2[IS_EMPTY] ? "" : string4;
  let styler = self2[STYLER];
  if (styler === void 0)
    return string4;
  let { openAll, closeAll } = styler;
  if (string4.includes("\x1B"))
    while (styler !== void 0)
      string4 = stringReplaceAll(string4, styler.close, styler.open), styler = styler.parent;
  let lfIndex = string4.indexOf(`
`);
  if (lfIndex !== -1)
    string4 = stringEncaseCRLFWithFirstIndex(string4, closeAll, openAll, lfIndex);
  return openAll + string4 + closeAll;
}, chalk, chalkStderr, source_default;

// node_modules/is-plain-obj/index.js

// node_modules/execa/lib/arguments/file-url.js
import { fileURLToPath } from "url";

// node_modules/execa/lib/methods/parameters.js

// node_modules/execa/lib/utils/uint-array.js
import { StringDecoder } from "string_decoder";
var objectToString2, isArrayBuffer = (value) => objectToString2.call(value) === "[object ArrayBuffer]", isUint8Array = (value) => objectToString2.call(value) === "[object Uint8Array]", bufferToUint8Array = (buffer) => new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength), textEncoder, stringToUint8Array = (string4) => textEncoder.encode(string4), textDecoder, uint8ArrayToString = (uint8Array) => textDecoder.decode(uint8Array), joinToString = (uint8ArraysOrStrings, encoding) => {
  return uint8ArraysToStrings(uint8ArraysOrStrings, encoding).join("");
}, uint8ArraysToStrings = (uint8ArraysOrStrings, encoding) => {
  if (encoding === "utf8" && uint8ArraysOrStrings.every((uint8ArrayOrString) => typeof uint8ArrayOrString === "string"))
    return uint8ArraysOrStrings;
  let decoder = new StringDecoder(encoding), strings = uint8ArraysOrStrings.map((uint8ArrayOrString) => typeof uint8ArrayOrString === "string" ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString).map((uint8Array) => decoder.write(uint8Array)), finalString = decoder.end();
  return finalString === "" ? strings : [...strings, finalString];
}, joinToUint8Array = (uint8ArraysOrStrings) => {
  if (uint8ArraysOrStrings.length === 1 && isUint8Array(uint8ArraysOrStrings[0]))
    return uint8ArraysOrStrings[0];
  return concatUint8Arrays(stringsToUint8Arrays(uint8ArraysOrStrings));
}, stringsToUint8Arrays = (uint8ArraysOrStrings) => uint8ArraysOrStrings.map((uint8ArrayOrString) => typeof uint8ArrayOrString === "string" ? stringToUint8Array(uint8ArrayOrString) : uint8ArrayOrString), concatUint8Arrays = (uint8Arrays) => {
  let result = new Uint8Array(getJoinLength(uint8Arrays)), index = 0;
  for (let uint8Array of uint8Arrays)
    result.set(uint8Array, index), index += uint8Array.length;
  return result;
}, getJoinLength = (uint8Arrays) => {
  let joinLength = 0;
  for (let uint8Array of uint8Arrays)
    joinLength += uint8Array.length;
  return joinLength;
};

// node_modules/execa/lib/methods/template.js
import { ChildProcess } from "child_process";
  ...tokens.slice(0, -1),
  `${tokens.at(-1)}${nextTokens[0]}`,
  ...nextTokens.slice(1)
], parseExpression = (expression) => {
  let typeOfExpression = typeof expression;
  if (typeOfExpression === "string")
    return expression;
  if (typeOfExpression === "number")
    return String(expression);
  if (isPlainObject2(expression) && (("stdout" in expression) || ("isMaxBuffer" in expression)))
    return getSubprocessResult(expression);
  if (expression instanceof ChildProcess || Object.prototype.toString.call(expression) === "[object Promise]")
    throw TypeError("Unexpected subprocess in template expression. Please use ${await subprocess} instead of ${subprocess}.");
  throw TypeError(`Unexpected "${typeOfExpression}" in template expression`);
}, getSubprocessResult = ({ stdout }) => {
  if (typeof stdout === "string")
    return stdout;
  if (isUint8Array(stdout))
    return uint8ArrayToString(stdout);
  if (stdout === void 0)
    throw TypeError(`Missing result.stdout in template expression. This is probably due to the previous subprocess' "stdout" option.`);
  throw TypeError(`Unexpected "${typeof stdout}" stdout in template expression`);
};

// node_modules/execa/lib/utils/standard-stream.js
import process4 from "process";

// node_modules/execa/lib/arguments/specific.js
import { debuglog } from "util";

// node_modules/execa/lib/verbose/values.js

// node_modules/execa/lib/arguments/escape.js
import { platform } from "process";
import { stripVTControlCharacters } from "util";
`).map((line) => escapeControlCharacters(line)).join(`
`), escapeControlCharacters = (line) => line.replaceAll(SPECIAL_CHAR_REGEXP, (character) => escapeControlCharacter(character)), escapeControlCharacter = (character) => {
  let commonEscape = COMMON_ESCAPES[character];
  if (commonEscape !== void 0)
    return commonEscape;
  let codepoint = character.codePointAt(0), codepointHex = codepoint.toString(16);
  return codepoint <= ASTRAL_START ? `\\u${codepointHex.padStart(4, "0")}` : `\\U${codepointHex}`;
}, getSpecialCharRegExp = () => {
  try {
    return new RegExp("\\p{Separator}|\\p{Other}", "gu");
  } catch {
    return /[\s\u0000-\u001F\u007F-\u009F\u00AD]/g;
  }
}, SPECIAL_CHAR_REGEXP, COMMON_ESCAPES, ASTRAL_START = 65535, quoteString = (escapedArgument) => {
  if (NO_ESCAPE_REGEXP.test(escapedArgument))
    return escapedArgument;
  return platform === "win32" ? `"${escapedArgument.replaceAll('"', '""')}"` : `'${escapedArgument.replaceAll("'", "'\\''")}'`;
}, NO_ESCAPE_REGEXP;

// node_modules/is-unicode-supported/index.js
import process5 from "process";

// node_modules/figures/index.js
var common, specialMainSymbols, specialFallbackSymbols, mainSymbols, fallbackSymbols, shouldUseMain, figures, figures_default, replacements;

// node_modules/yoctocolors/base.js
import tty2 from "tty";
var hasColors, format = (open2, close) => {
  if (!hasColors)
    return (input) => input;
  let openCode = `\x1B[${open2}m`, closeCode = `\x1B[${close}m`;
  return (input) => {
    let string4 = input + "", index = string4.indexOf(closeCode);
    if (index === -1)
      return openCode + string4 + closeCode;
    let result = openCode, lastIndex = 0, replaceCode = (close === 22 ? closeCode : "") + openCode;
    while (index !== -1)
      result += string4.slice(lastIndex, index) + replaceCode, lastIndex = index + closeCode.length, index = string4.indexOf(closeCode, lastIndex);
    return result += string4.slice(lastIndex) + closeCode, result;
  };
}, reset, bold, dim, italic, underline, overline, inverse, hidden, strikethrough, black, red, green, yellow, blue, magenta, cyan, white, gray, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright;

// node_modules/yoctocolors/index.js

// node_modules/execa/lib/verbose/default.js

// node_modules/execa/lib/verbose/custom.js
`) ? printedLine : `${printedLine}
`;

// node_modules/execa/lib/verbose/log.js
import { inspect } from "util";
`).map((message) => getPrintedLine({ ...verboseObject, message })), getPrintedLine = (verboseObject) => {
  return { verboseLine: defaultVerboseFunction(verboseObject), verboseObject };
}, serializeVerboseMessage = (message) => {
  let messageString = typeof message === "string" ? message : inspect(message);
  return escapeLines(messageString).replaceAll("\t", " ".repeat(TAB_SIZE));
}, TAB_SIZE = 2;

// node_modules/execa/lib/verbose/start.js

// node_modules/execa/lib/verbose/info.js

// node_modules/execa/lib/return/duration.js
import { hrtime } from "process";

// node_modules/execa/lib/arguments/command.js

// node_modules/isexe/windows.js

// node_modules/isexe/mode.js

// node_modules/isexe/index.js

// node_modules/which/which.js

// node_modules/path-key/index.js

// node_modules/cross-spawn/lib/util/resolveCommand.js

// node_modules/cross-spawn/lib/util/escape.js

// node_modules/shebang-regex/index.js

// node_modules/shebang-command/index.js

// node_modules/cross-spawn/lib/util/readShebang.js

// node_modules/cross-spawn/lib/parse.js

// node_modules/cross-spawn/lib/enoent.js

// node_modules/cross-spawn/index.js

// node_modules/npm-run-path/node_modules/path-key/index.js

// node_modules/unicorn-magic/node.js
import { promisify } from "util";
import { execFile as execFileCallback, execFileSync as execFileSyncOriginal } from "child_process";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var execFileOriginal;

// node_modules/npm-run-path/index.js
import process6 from "process";
import path3 from "path";

// node_modules/execa/lib/return/final-error.js

// node_modules/human-signals/build/src/realtime.js

// node_modules/human-signals/build/src/core.js
var SIGNALS;

// node_modules/human-signals/build/src/signals.js
import { constants } from "os";

// node_modules/human-signals/build/src/main.js
import { constants as constants2 } from "os";

// node_modules/execa/lib/terminate/signal.js
import { constants as constants3 } from "os";
Available signal numbers: ${getAvailableSignalIntegers()}.`, getAvailableSignalNames = () => Object.keys(constants3.signals).sort().map((signalName) => `'${signalName}'`).join(", "), getAvailableSignalIntegers = () => [...new Set(Object.values(constants3.signals).sort((signalInteger, signalIntegerTwo) => signalInteger - signalIntegerTwo))].join(", "), getSignalDescription = (signal) => signalsByName[signal].description;

// node_modules/execa/lib/terminate/kill.js
import { setTimeout as setTimeout2 } from "timers/promises";

// node_modules/execa/lib/utils/abort-signal.js
import { once } from "events";

// node_modules/execa/lib/terminate/cancel.js

// node_modules/execa/lib/ipc/validation.js

// node_modules/execa/lib/utils/deferred.js

// node_modules/execa/lib/arguments/fd-options.js

// node_modules/execa/lib/utils/max-listeners.js
import { addAbortListener } from "events";

// node_modules/execa/lib/ipc/reference.js

// node_modules/execa/lib/ipc/incoming.js
import { once as once2 } from "events";
import { scheduler } from "timers/promises";

// node_modules/execa/lib/ipc/forward.js
import { EventEmitter } from "events";

// node_modules/execa/lib/ipc/strict.js
import { once as once3 } from "events";

// node_modules/execa/lib/ipc/outgoing.js

// node_modules/execa/lib/ipc/send.js
import { promisify as promisify2 } from "util";

// node_modules/execa/lib/ipc/graceful.js
import { scheduler as scheduler2 } from "timers/promises";

// node_modules/execa/lib/terminate/graceful.js

// node_modules/execa/lib/terminate/timeout.js
import { setTimeout as setTimeout3 } from "timers/promises";

// node_modules/execa/lib/methods/node.js
import { execPath, execArgv } from "process";
import path4 from "path";

// node_modules/execa/lib/ipc/ipc-input.js
import { serialize } from "v8";

// node_modules/execa/lib/arguments/encoding-option.js

// node_modules/execa/lib/arguments/cwd.js
import { statSync as statSync2 } from "fs";
import path5 from "path";
import process7 from "process";

// node_modules/execa/lib/arguments/options.js
import path6 from "path";
import process8 from "process";
var import_cross_spawn, normalizeOptions = (filePath, rawArguments, rawOptions) => {
  rawOptions.cwd = normalizeCwd(rawOptions.cwd);
  let [processedFile, processedArguments, processedOptions] = handleNodeOption(filePath, rawArguments, rawOptions), { command: file2, args: commandArguments, options: initialOptions } = import_cross_spawn.default._parse(processedFile, processedArguments, processedOptions), fdOptions = normalizeFdSpecificOptions(initialOptions), options = addDefaultOptions(fdOptions);
  if (validateTimeout(options), validateEncoding(options), validateIpcInputOption(options), validateCancelSignal(options), validateGracefulCancel(options), options.shell = normalizeFileUrl(options.shell), options.env = getEnv(options), options.killSignal = normalizeKillSignal(options.killSignal), options.forceKillAfterDelay = normalizeForceKillAfterDelay(options.forceKillAfterDelay), options.lines = options.lines.map((lines, fdNumber) => lines && !BINARY_ENCODINGS.has(options.encoding) && options.buffer[fdNumber]), process8.platform === "win32" && path6.basename(file2, ".exe") === "cmd")
    commandArguments.unshift("/q");
  return { file: file2, commandArguments, options };
}, addDefaultOptions = ({
  extendEnv = !0,
  preferLocal = !1,
  cwd: cwd2,
  localDir: localDirectory = cwd2,
  encoding = "utf8",
  reject = !0,
  cleanup = !0,
  all = !1,
  windowsHide = !0,
  killSignal = "SIGTERM",
  forceKillAfterDelay = !0,
  gracefulCancel = !1,
  ipcInput,
  ipc = ipcInput !== void 0 || gracefulCancel,
  serialization = "advanced",
  ...options
}) => ({
  ...options,
  extendEnv,
  preferLocal,
  cwd: cwd2,
  localDirectory,
  encoding,
  reject,
  cleanup,
  all,
  windowsHide,
  killSignal,
  forceKillAfterDelay,
  gracefulCancel,
  ipcInput,
  ipc,
  serialization
}), getEnv = ({ env: envOption, extendEnv, preferLocal, node, localDirectory, nodePath: nodePath2 }) => {
  let env2 = extendEnv ? { ...process8.env, ...envOption } : envOption;
  if (preferLocal || node)
    return npmRunPathEnv({
      env: env2,
      cwd: localDirectory,
      execPath: nodePath2,
      preferLocal,
      addExecPath: node
    });
  return env2;
};

// node_modules/execa/lib/arguments/shell.js

// node_modules/is-stream/index.js

// node_modules/@sec-ant/readable-stream/dist/ponyfill/asyncIterator.js
var a, n, u;

// node_modules/@sec-ant/readable-stream/dist/ponyfill/fromAnyIterable.js

// node_modules/@sec-ant/readable-stream/dist/ponyfill/index.js

// node_modules/get-stream/source/stream.js

// node_modules/get-stream/source/contents.js

// node_modules/get-stream/source/utils.js

// node_modules/get-stream/source/array.js

// node_modules/get-stream/source/array-buffer.js

// node_modules/get-stream/source/string.js

// node_modules/get-stream/source/exports.js

// node_modules/get-stream/source/index.js
import { on } from "events";
import { finished } from "stream/promises";

// node_modules/execa/lib/io/max-buffer.js

// node_modules/execa/lib/return/message.js
import { inspect as inspect2 } from "util";
`) : serializeMessageItem(messagePart), serializeMessageItem = (messageItem) => {
  if (typeof messageItem === "string")
    return messageItem;
  if (isUint8Array(messageItem))
    return uint8ArrayToString(messageItem);
  return "";
};

// node_modules/execa/lib/return/result.js

// node_modules/parse-ms/index.js

// node_modules/execa/lib/verbose/error.js

// node_modules/execa/lib/verbose/complete.js

// node_modules/execa/lib/return/reject.js

// node_modules/execa/lib/stdio/type.js

// node_modules/execa/lib/transform/object-mode.js

// node_modules/execa/lib/transform/normalize.js
  ...getTransforms(stdioItems, optionName, direction, options)
], getTransforms = (stdioItems, optionName, direction, { encoding }) => {
  let transforms = stdioItems.filter(({ type }) => TRANSFORM_TYPES.has(type)), newTransforms = Array.from({ length: transforms.length });
  for (let [index, stdioItem] of Object.entries(transforms))
    newTransforms[index] = normalizeTransform({
      stdioItem,
      index: Number(index),
      newTransforms,
      optionName,
      direction,
      encoding
    });
  return sortTransforms(newTransforms, direction);
}, normalizeTransform = ({ stdioItem, stdioItem: { type }, index, newTransforms, optionName, direction, encoding }) => {
  if (type === "duplex")
    return normalizeDuplex({ stdioItem, optionName });
  if (type === "webTransform")
    return normalizeTransformStream({
      stdioItem,
      index,
      newTransforms,
      direction
    });
  return normalizeGenerator({
    stdioItem,
    index,
    newTransforms,
    direction,
    encoding
  });
}, normalizeDuplex = ({
  stdioItem,
  stdioItem: {
    value: {
      transform: transform2,
      transform: { writableObjectMode, readableObjectMode },
      objectMode = readableObjectMode
    }
  },
  optionName
}) => {
  if (objectMode && !readableObjectMode)
    throw TypeError(`The \`${optionName}.objectMode\` option can only be \`true\` if \`new Duplex({objectMode: true})\` is used.`);
  if (!objectMode && readableObjectMode)
    throw TypeError(`The \`${optionName}.objectMode\` option cannot be \`false\` if \`new Duplex({objectMode: true})\` is used.`);
  return {
    ...stdioItem,
    value: { transform: transform2, writableObjectMode, readableObjectMode }
  };
}, normalizeTransformStream = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction }) => {
  let { transform: transform2, objectMode } = isPlainObject2(value) ? value : { transform: value }, { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
  return {
    ...stdioItem,
    value: { transform: transform2, writableObjectMode, readableObjectMode }
  };
}, normalizeGenerator = ({ stdioItem, stdioItem: { value }, index, newTransforms, direction, encoding }) => {
  let {
    transform: transform2,
    final,
    binary: binaryOption = !1,
    preserveNewlines = !1,
    objectMode
  } = isPlainObject2(value) ? value : { transform: value }, binary = binaryOption || BINARY_ENCODINGS.has(encoding), { writableObjectMode, readableObjectMode } = getTransformObjectModes(objectMode, index, newTransforms, direction);
  return {
    ...stdioItem,
    value: {
      transform: transform2,
      final,
      binary,
      preserveNewlines,
      writableObjectMode,
      readableObjectMode
    }
  };
}, sortTransforms = (newTransforms, direction) => direction === "input" ? newTransforms.reverse() : newTransforms;

// node_modules/execa/lib/stdio/direction.js
import process9 from "process";

// node_modules/execa/lib/ipc/array.js

// node_modules/execa/lib/stdio/native.js
import { readFileSync as readFileSync2 } from "fs";
import tty3 from "tty";

// node_modules/execa/lib/stdio/input-option.js
  ...handleInputOption(input),
  ...handleInputFileOption(inputFile)
] : [], handleInputOption = (input) => input === void 0 ? [] : [{
  type: getInputType(input),
  value: input,
  optionName: "input"
}], getInputType = (input) => {
  if (isReadableStream(input, { checkOpen: !1 }))
    return "nodeStream";
  if (typeof input === "string")
    return "string";
  if (isUint8Array(input))
    return "uint8Array";
  throw Error("The `input` option must be a string, a Uint8Array or a Node.js Readable stream.");
}, handleInputFileOption = (inputFile) => inputFile === void 0 ? [] : [{
  ...getInputFileType(inputFile),
  optionName: "inputFile"
}], getInputFileType = (inputFile) => {
  if (isUrl(inputFile))
    return { type: "fileUrl", value: inputFile };
  if (isFilePathString(inputFile))
    return { type: "filePath", value: { file: inputFile } };
  throw Error("The `inputFile` option must be a file path string or a file URL.");
};

// node_modules/execa/lib/stdio/duplicate.js

// node_modules/execa/lib/stdio/handle.js

// node_modules/execa/lib/stdio/handle-sync.js
import { readFileSync as readFileSync3 } from "fs";

// node_modules/execa/lib/io/strip-newline.js

// node_modules/execa/lib/transform/split.js

// node_modules/execa/lib/transform/validate.js
import { Buffer as Buffer4 } from "buffer";

// node_modules/execa/lib/transform/encoding-transform.js
import { Buffer as Buffer5 } from "buffer";
import { StringDecoder as StringDecoder2 } from "string_decoder";

// node_modules/execa/lib/transform/run-async.js
import { callbackify } from "util";
var pushChunks, transformChunk = async function* (chunk, generators, index) {
  if (index === generators.length) {
    yield chunk;
    return;
  }
  let { transform: transform2 = identityGenerator } = generators[index];
  for await (let transformedChunk of transform2(chunk))
    yield* transformChunk(transformedChunk, generators, index + 1);
}, finalChunks = async function* (generators) {
  for (let [index, { final }] of Object.entries(generators))
    yield* generatorFinalChunks(final, Number(index), generators);
}, generatorFinalChunks = async function* (final, index, generators) {
  if (final === void 0)
    return;
  for await (let finalChunk of final())
    yield* transformChunk(finalChunk, generators, index + 1);
}, destroyTransform, identityGenerator = function* (chunk) {
  yield chunk;
};

// node_modules/execa/lib/transform/run-sync.js
  ...chunks.flatMap((chunk) => [...transformChunkSync(chunk, generators, 0)]),
  ...finalChunksSync(generators)
], transformChunkSync = function* (chunk, generators, index) {
  if (index === generators.length) {
    yield chunk;
    return;
  }
  let { transform: transform2 = identityGenerator2 } = generators[index];
  for (let transformedChunk of transform2(chunk))
    yield* transformChunkSync(transformedChunk, generators, index + 1);
}, finalChunksSync = function* (generators) {
  for (let [index, { final }] of Object.entries(generators))
    yield* generatorFinalChunksSync(final, Number(index), generators);
}, generatorFinalChunksSync = function* (final, index, generators) {
  if (final === void 0)
    return;
  for (let finalChunk of final())
    yield* transformChunkSync(finalChunk, generators, index + 1);
}, identityGenerator2 = function* (chunk) {
  yield chunk;
};

// node_modules/execa/lib/transform/generator.js
import { Transform, getDefaultHighWaterMark } from "stream";

// node_modules/execa/lib/io/input-sync.js

// node_modules/execa/lib/verbose/output.js

// node_modules/execa/lib/io/output-sync.js
import { writeFileSync, appendFileSync as appendFileSync2 } from "fs";

// node_modules/execa/lib/resolve/all-sync.js

// node_modules/execa/lib/resolve/exit-async.js
import { once as once4 } from "events";

// node_modules/execa/lib/resolve/exit-sync.js

// node_modules/execa/lib/methods/main-sync.js
import { spawnSync } from "child_process";

// node_modules/execa/lib/ipc/get-one.js
import { once as once5, on as on2 } from "events";

// node_modules/execa/lib/ipc/get-each.js
import { once as once6, on as on3 } from "events";

// node_modules/execa/lib/ipc/methods.js
import process10 from "process";

// node_modules/execa/lib/return/early-error.js
import { ChildProcess as ChildProcess2 } from "child_process";
import {
  PassThrough,
  Readable,
  Writable,
  Duplex
} from "stream";

// node_modules/execa/lib/stdio/handle-async.js
import { createReadStream, createWriteStream as createWriteStream2 } from "fs";
import { Buffer as Buffer6 } from "buffer";
import { Readable as Readable2, Writable as Writable2, Duplex as Duplex2 } from "stream";

// node_modules/@sindresorhus/merge-streams/index.js
import { on as on4, once as once7 } from "events";
import { PassThrough as PassThroughStream, getDefaultHighWaterMark as getDefaultHighWaterMark2 } from "stream";
import { finished as finished2 } from "stream/promises";

// node_modules/execa/lib/io/pipeline.js
import { finished as finished3 } from "stream/promises";

// node_modules/execa/lib/io/output-async.js

// node_modules/signal-exit/dist/mjs/signals.js
var signals;

// node_modules/signal-exit/dist/mjs/index.js


// node_modules/execa/lib/terminate/cleanup.js
import { addAbortListener as addAbortListener2 } from "events";

// node_modules/execa/lib/pipe/pipe-arguments.js

// node_modules/execa/lib/pipe/throw.js

// node_modules/execa/lib/pipe/sequence.js

// node_modules/execa/lib/pipe/streaming.js
import { finished as finished4 } from "stream/promises";

// node_modules/execa/lib/pipe/abort.js
import { aborted as aborted2 } from "util";

// node_modules/execa/lib/pipe/setup.js

// node_modules/execa/lib/io/iterate.js
import { on as on5 } from "events";
import { getDefaultHighWaterMark as getDefaultHighWaterMark3 } from "stream";
  getEncodingTransformGenerator(binary, encoding, !shouldEncode),
  getSplitLinesGenerator(binary, preserveNewlines, !shouldSplit, {})
].filter(Boolean);

// node_modules/execa/lib/io/contents.js
import { setImmediate as setImmediate2 } from "timers/promises";

// node_modules/execa/lib/resolve/wait-stream.js
import { finished as finished5 } from "stream/promises";

// node_modules/execa/lib/resolve/stdio.js

// node_modules/execa/lib/resolve/all-async.js

// node_modules/execa/lib/verbose/ipc.js

// node_modules/execa/lib/ipc/buffer-messages.js

// node_modules/execa/lib/resolve/wait-subprocess.js
import { once as once8 } from "events";

// node_modules/execa/lib/convert/concurrent.js

// node_modules/execa/lib/convert/shared.js
import { finished as finished6 } from "stream/promises";

// node_modules/execa/lib/convert/readable.js
import { Readable as Readable3 } from "stream";
import { callbackify as callbackify2 } from "util";

// node_modules/execa/lib/convert/writable.js
import { Writable as Writable3 } from "stream";
import { callbackify as callbackify3 } from "util";

// node_modules/execa/lib/convert/duplex.js
import { Duplex as Duplex3 } from "stream";
import { callbackify as callbackify4 } from "util";

// node_modules/execa/lib/convert/iterable.js

// node_modules/execa/lib/convert/add.js

// node_modules/execa/lib/methods/promise.js

// node_modules/execa/lib/methods/main-async.js
import { setMaxListeners } from "events";
import { spawn } from "child_process";

// node_modules/execa/lib/methods/bind.js

// node_modules/execa/lib/methods/create.js

// node_modules/execa/lib/methods/command.js

// node_modules/execa/lib/methods/script.js

// node_modules/execa/index.js
var execa, execaSync, execaCommand, execaCommandSync, execaNode, $, sendMessage2, getOneMessage2, getEachMessage2, getCancelSignal2;


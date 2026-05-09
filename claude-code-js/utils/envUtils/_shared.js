// Shared module state and imports
// Original: src/utils/envUtils.ts
import { homedir } from "os";
import { join } from "path";
var getClaudeConfigHomeDir, VERTEX_REGION_OVERRIDES;

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs

// node_modules/@anthropic-ai/sdk/internal/errors.mjs

// node_modules/@anthropic-ai/sdk/core/error.mjs
var AnthropicError, APIError, APIUserAbortError, APIConnectionError, APIConnectionTimeoutError, BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, ConflictError, UnprocessableEntityError, RateLimitError, InternalServerError;

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
var startsWithSchemeRegexp, isAbsoluteURL = (url) => {
  return startsWithSchemeRegexp.test(url);
}, validatePositiveInteger = (name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n))
    throw new AnthropicError(`${name} must be an integer`);
  if (n < 0)
    throw new AnthropicError(`${name} must be a positive integer`);
  return n;
}, safeJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return;
  }
};

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
var levelNumbers, parseLogLevel = (maybeLevel, sourceName, client) => {
  if (!maybeLevel)
    return;
  if (hasOwn(levelNumbers, maybeLevel))
    return maybeLevel;
  loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
  return;
}, noopLogger, cachedLoggers, formatRequestDetails = (details) => {
  if (details.options)
    details.options = { ...details.options }, delete details.options.headers;
  if (details.headers)
    details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
      name,
      name.toLowerCase() === "x-api-key" || name.toLowerCase() === "authorization" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
    ]));
  if ("retryOfRequestLogID" in details) {
    if (details.retryOfRequestLogID)
      details.retryOf = details.retryOfRequestLogID;
    delete details.retryOfRequestLogID;
  }
  return details;
};

// node_modules/@anthropic-ai/sdk/version.mjs

// node_modules/@anthropic-ai/sdk/internal/shims.mjs

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
var encodeUTF8_, decodeUTF8_;

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
var _LineDecoder_buffer, _LineDecoder_carriageReturnIndex;

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    if (controller.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative")
      throw new AnthropicError("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
    throw new AnthropicError("Attempted to iterate over a response with no body");
  }
  let sseDecoder = new SSEDecoder, lineDecoder = new LineDecoder, iter = ReadableStreamToAsyncIterable(response.body);
  for await (let sseChunk of iterSSEChunks(iter))
    for (let line of lineDecoder.decode(sseChunk)) {
      let sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  for (let line of lineDecoder.flush()) {
    let sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array;
  for await (let chunk of iterator) {
    if (chunk == null)
      continue;
    let binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk, newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data), newData.set(binaryChunk, data.length), data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1)
      yield data.slice(0, patternIndex), data = data.slice(patternIndex);
  }
  if (data.length > 0)
    yield data;
}

var Stream;

// node_modules/@anthropic-ai/sdk/internal/parse.mjs

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var _APIPromise_client, APIPromise;

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var _AbstractPage_client, AbstractPage, PagePromise, Page;

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs

// node_modules/@anthropic-ai/sdk/core/uploads.mjs

// node_modules/@anthropic-ai/sdk/resources/shared.mjs

// node_modules/@anthropic-ai/sdk/core/resource.mjs

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
function* iterateHeaders(headers) {
  if (!headers)
    return;
  if (brand_privateNullableHeaders in headers) {
    let { values, nulls } = headers;
    yield* values.entries();
    for (let name of nulls)
      yield [name, null];
    return;
  }
  let shouldClear = !1, iter;
  if (headers instanceof Headers)
    iter = headers.entries();
  else if (isArray2(headers))
    iter = headers;
  else
    shouldClear = !0, iter = Object.entries(headers ?? {});
  for (let row of iter) {
    let name = row[0];
    if (typeof name !== "string")
      throw TypeError("expected header name to be a string");
    let values = isArray2(row[1]) ? row[1] : [row[1]], didClear = !1;
    for (let value of values) {
      if (value === void 0)
        continue;
      if (shouldClear && !didClear)
        didClear = !0, yield [name, null];
      yield [name, value];
    }
  }
}
var brand_privateNullableHeaders, isArray2, buildHeaders = (newHeaders) => {
  let targetHeaders = /* @__PURE__ */ new Headers, nullHeaders = /* @__PURE__ */ new Set;
  for (let headers of newHeaders) {
    let seenHeaders = /* @__PURE__ */ new Set;
    for (let [name, value] of iterateHeaders(headers)) {
      let lowerName = name.toLowerCase();
      if (!seenHeaders.has(lowerName))
        targetHeaders.delete(name), seenHeaders.add(lowerName);
      if (value === null)
        targetHeaders.delete(name), nullHeaders.add(lowerName);
      else
        targetHeaders.append(name, value), nullHeaders.delete(lowerName);
    }
  }
  return { [brand_privateNullableHeaders]: !0, values: targetHeaders, nulls: nullHeaders };
};

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var Files;

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var Models;

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var JSONLDecoder;

// node_modules/@anthropic-ai/sdk/error.mjs

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches;

// node_modules/@anthropic-ai/sdk/streaming.mjs

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
      else if (item === "]")
        tokens.push({
          type: "paren",
          value: "]"
        });
    });
  return tokens;
}, generate = (tokens) => {
  let output = "";
  return tokens.map((token) => {
    switch (token.type) {
      case "string":
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  }), output;
}, partialParse = (input) => JSON.parse(generate(unstrip(strip(tokenize(input)))));

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var _BetaMessageStream_instances, _BetaMessageStream_currentMessageSnapshot, _BetaMessageStream_connectedPromise, _BetaMessageStream_resolveConnectedPromise, _BetaMessageStream_rejectConnectedPromise, _BetaMessageStream_endPromise, _BetaMessageStream_resolveEndPromise, _BetaMessageStream_rejectEndPromise, _BetaMessageStream_listeners, _BetaMessageStream_ended, _BetaMessageStream_errored, _BetaMessageStream_aborted, _BetaMessageStream_catchingPromiseCreated, _BetaMessageStream_response, _BetaMessageStream_request_id, _BetaMessageStream_getFinalMessage, _BetaMessageStream_getFinalText, _BetaMessageStream_handleError, _BetaMessageStream_beginRequest, _BetaMessageStream_addStreamEvent, _BetaMessageStream_endRequest, _BetaMessageStream_accumulateMessage, JSON_BUF_PROPERTY = "__json_buf", BetaMessageStream;

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
var MODEL_NONSTREAMING_TOKENS;

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var DEPRECATED_MODELS, Messages;

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta;

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Completions;

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var _MessageStream_instances, _MessageStream_currentMessageSnapshot, _MessageStream_connectedPromise, _MessageStream_resolveConnectedPromise, _MessageStream_rejectConnectedPromise, _MessageStream_endPromise, _MessageStream_resolveEndPromise, _MessageStream_rejectEndPromise, _MessageStream_listeners, _MessageStream_ended, _MessageStream_errored, _MessageStream_aborted, _MessageStream_catchingPromiseCreated, _MessageStream_response, _MessageStream_request_id, _MessageStream_getFinalMessage, _MessageStream_getFinalText, _MessageStream_handleError, _MessageStream_beginRequest, _MessageStream_addStreamEvent, _MessageStream_endRequest, _MessageStream_accumulateMessage, JSON_BUF_PROPERTY2 = "__json_buf", MessageStream;

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Batches2;

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var Messages2, DEPRECATED_MODELS2;

// node_modules/@anthropic-ai/sdk/resources/models.mjs
var Models2;

// node_modules/@anthropic-ai/sdk/resources/index.mjs

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs

// node_modules/@anthropic-ai/sdk/client.mjs
var _a, _BaseAnthropic_encoder, Anthropic;

// node_modules/@anthropic-ai/sdk/index.mjs


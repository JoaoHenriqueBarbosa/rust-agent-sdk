// Shared module state and imports
// Original: src/coordinator/coordinatorMode.ts

// node_modules/zod/v4/mini/parse.js

// node_modules/zod/v4/mini/schemas.js

// node_modules/zod/v4/mini/checks.js

// node_modules/zod/v4/mini/iso.js

// node_modules/zod/v4/mini/coerce.js

// node_modules/zod/v4/mini/external.js

// node_modules/zod/v4/mini/index.js

// node_modules/zod/v4-mini/index.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js

// node_modules/zod-to-json-schema/dist/esm/Options.js
var ignoreOverride;

// node_modules/zod-to-json-schema/dist/esm/Refs.js
// node_modules/zod-to-json-schema/dist/esm/parsers/any.js

// node_modules/zod-to-json-schema/dist/esm/parsers/array.js

// node_modules/zod-to-json-schema/dist/esm/parsers/bigint.js
// node_modules/zod-to-json-schema/dist/esm/parsers/branded.js

// node_modules/zod-to-json-schema/dist/esm/parsers/catch.js

// node_modules/zod-to-json-schema/dist/esm/parsers/date.js

// node_modules/zod-to-json-schema/dist/esm/parsers/default.js

// node_modules/zod-to-json-schema/dist/esm/parsers/effects.js
// node_modules/zod-to-json-schema/dist/esm/parsers/intersection.js
// node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var ALPHA_NUMERIC;

// node_modules/zod-to-json-schema/dist/esm/parsers/record.js

// node_modules/zod-to-json-schema/dist/esm/parsers/map.js
// node_modules/zod-to-json-schema/dist/esm/parsers/never.js
// node_modules/zod-to-json-schema/dist/esm/parsers/union.js

// node_modules/zod-to-json-schema/dist/esm/parsers/nullable.js

// node_modules/zod-to-json-schema/dist/esm/parsers/number.js

// node_modules/zod-to-json-schema/dist/esm/parsers/object.js

// node_modules/zod-to-json-schema/dist/esm/parsers/optional.js

// node_modules/zod-to-json-schema/dist/esm/parsers/pipeline.js

// node_modules/zod-to-json-schema/dist/esm/parsers/promise.js

// node_modules/zod-to-json-schema/dist/esm/parsers/set.js

// node_modules/zod-to-json-schema/dist/esm/parsers/tuple.js

// node_modules/zod-to-json-schema/dist/esm/parsers/undefined.js

// node_modules/zod-to-json-schema/dist/esm/parsers/unknown.js

// node_modules/zod-to-json-schema/dist/esm/parsers/readonly.js

// node_modules/zod-to-json-schema/dist/esm/selectParser.js

// node_modules/zod-to-json-schema/dist/esm/parseDef.js

// node_modules/zod-to-json-schema/dist/esm/parseTypes.js

// node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js

// node_modules/zod-to-json-schema/dist/esm/index.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/protocol.js

// node_modules/ajv-formats/dist/formats.js

// node_modules/ajv-formats/dist/limit.js

// node_modules/ajv-formats/dist/index.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/validation/ajv-provider.js

var import_ajv2, import_ajv_formats;

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/client.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/helpers.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js
var Client5;

// node_modules/eventsource-parser/dist/index.js
var ParseError;

// node_modules/eventsource/dist/index.js
var ErrorEvent, __typeError = (msg) => {
  throw TypeError(msg);
}, __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value), __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method), _readyState, _url2, _redirectUrl, _withCredentials, _fetch, _reconnectInterval, _reconnectTimer, _lastEventId, _controller, _parser, _onError, _onMessage, _onOpen, _EventSource_instances, connect_fn, _onFetchResponse, _onFetchError, getRequestOptions_fn, _onEvent, _onRetryChange, failConnection_fn, scheduleReconnect_fn, _reconnect, EventSource;

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/transport.js

// node_modules/pkce-challenge/dist/index.node.js
var crypto11;

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth.js
var SafeUrlSchema, OAuthProtectedResourceMetadataSchema, OAuthMetadataSchema, OpenIdProviderMetadataSchema, OpenIdProviderDiscoveryMetadataSchema, OAuthTokensSchema, OAuthErrorResponseSchema, OptionalSafeUrlSchema, OAuthClientMetadataSchema, OAuthClientInformationSchema, OAuthClientInformationFullSchema, OAuthClientRegistrationErrorSchema, OAuthTokenRevocationRequestSchema;

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth-utils.js

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/auth/errors.js
var OAuthError, InvalidRequestError, InvalidClientError, InvalidGrantError, UnauthorizedClientError, UnsupportedGrantTypeError, InvalidScopeError, AccessDeniedError, ServerError2, TemporarilyUnavailableError, UnsupportedResponseTypeError, UnsupportedTokenTypeError, InvalidTokenError, MethodNotAllowedError, TooManyRequestsError, InvalidClientMetadataError, InsufficientScopeError, InvalidTargetError, OAUTH_ERRORS;

// node_modules/@modelcontextprotocol/sdk/dist/esm/client/auth.js
var UnauthorizedError, AUTHORIZATION_CODE_RESPONSE_TYPE = "code", AUTHORIZATION_CODE_CHALLENGE_METHOD = "S256";

// node_modules/@modelcontextprotocol/sdk/dist/esm/client/sse.js
var SseError;

// node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js
import process22 from "process";
import { PassThrough as PassThrough3 } from "stream";

var import_cross_spawn2, DEFAULT_INHERITED_ENV_VARS;

// node_modules/eventsource-parser/dist/stream.js
var EventSourceParserStream;

// node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js
var DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS, StreamableHTTPError;

// node_modules/p-map/index.js
var pMapSkip;


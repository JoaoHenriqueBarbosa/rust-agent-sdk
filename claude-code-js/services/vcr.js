// Original: src/services/vcr.ts
import { createHash as createHash17, randomUUID as randomUUID19 } from "crypto";
import { mkdir as mkdir20, readFile as readFile31, writeFile as writeFile23 } from "fs/promises";
import { dirname as dirname38, join as join90 } from "path";
function shouldUseVCR() {
  return !1;
}
async function withFixture(input, fixtureName, f) {
  if (!shouldUseVCR())
    return await f();
  let hash = createHash17("sha1").update(jsonStringify(input)).digest("hex").slice(0, 12), filename = join90(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? getCwd(), `fixtures/${fixtureName}-${hash}.json`);
  try {
    return jsonParse(await readFile31(filename, { encoding: "utf8" }));
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      throw e;
  }
  if ((env3.isCI || process.env.CI) && !isEnvTruthy(process.env.VCR_RECORD))
    throw Error(`Fixture missing: ${filename}. Re-run tests with VCR_RECORD=1, then commit the result.`);
  let result = await f();
  return await mkdir20(dirname38(filename), { recursive: !0 }), await writeFile23(filename, jsonStringify(result, null, 2), {
    encoding: "utf8"
  }), result;
}
async function withVCR(messages, f) {
  if (!shouldUseVCR())
    return await f();
  let messagesForAPI = normalizeMessagesForAPI(messages.filter((_) => {
    if (_.type !== "user")
      return !0;
    if (_.isMeta)
      return !1;
    return !0;
  })), dehydratedInput = mapMessages(messagesForAPI.map((_) => _.message.content), dehydrateValue), filename = join90(process.env.CLAUDE_CODE_TEST_FIXTURES_ROOT ?? getCwd(), `fixtures/${dehydratedInput.map((_) => createHash17("sha1").update(jsonStringify(_)).digest("hex").slice(0, 6)).join("-")}.json`);
  try {
    let cached3 = jsonParse(await readFile31(filename, { encoding: "utf8" }));
    return cached3.output.forEach(addCachedCostToTotalSessionCost), cached3.output.map((message, index) => mapMessage(message, hydrateValue, index, randomUUID19()));
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      throw e;
  }
  if (env3.isCI && !isEnvTruthy(process.env.VCR_RECORD))
    throw Error(`Anthropic API fixture missing: ${filename}. Re-run tests with VCR_RECORD=1, then commit the result. Input messages:
${jsonStringify(dehydratedInput, null, 2)}`);
  let results = await f();
  if (env3.isCI && !isEnvTruthy(process.env.VCR_RECORD))
    return results;
  return await mkdir20(dirname38(filename), { recursive: !0 }), await writeFile23(filename, jsonStringify({
    input: dehydratedInput,
    output: results.map((message, index) => mapMessage(message, dehydrateValue, index))
  }, null, 2), { encoding: "utf8" }), results;
}
function addCachedCostToTotalSessionCost(message) {
  if (message.type === "stream_event")
    return;
  let model = message.message.model, usage = message.message.usage, costUSD = calculateUSDCost(model, usage);
  addToTotalSessionCost(costUSD, usage, model);
}
function mapMessages(messages, f) {
  return messages.map((_) => {
    if (typeof _ === "string")
      return f(_);
    return _.map((_2) => {
      switch (_2.type) {
        case "tool_result":
          if (typeof _2.content === "string")
            return { ..._2, content: f(_2.content) };
          if (Array.isArray(_2.content))
            return {
              ..._2,
              content: _2.content.map((_3) => {
                switch (_3.type) {
                  case "text":
                    return { ..._3, text: f(_3.text) };
                  case "image":
                    return _3;
                  default:
                    return;
                }
              })
            };
          return _2;
        case "text":
          return { ..._2, text: f(_2.text) };
        case "tool_use":
          return {
            ..._2,
            input: mapValuesDeep(_2.input, f)
          };
        case "image":
          return _2;
        default:
          return;
      }
    });
  });
}
function mapValuesDeep(obj, f) {
  return mapValues_default(obj, (val, key3) => {
    if (Array.isArray(val))
      return val.map((_) => mapValuesDeep(_, f));
    if (isPlainObject_default(val))
      return mapValuesDeep(val, f);
    return f(val, key3, obj);
  });
}
function mapAssistantMessage(message, f, index, uuid8) {
  return {
    uuid: uuid8 ?? `UUID-${index}`,
    requestId: "REQUEST_ID",
    timestamp: message.timestamp,
    message: {
      ...message.message,
      content: message.message.content.map((_) => {
        switch (_.type) {
          case "text":
            return {
              ..._,
              text: f(_.text),
              citations: _.citations || []
            };
          case "tool_use":
            return {
              ..._,
              input: mapValuesDeep(_.input, f)
            };
          default:
            return _;
        }
      }).filter(Boolean)
    },
    type: "assistant"
  };
}
function mapMessage(message, f, index, uuid8) {
  if (message.type === "assistant")
    return mapAssistantMessage(message, f, index, uuid8);
  else
    return message;
}
function dehydrateValue(s2) {
  if (typeof s2 !== "string")
    return s2;
  let cwd2 = getCwd(), configHome = getClaudeConfigHomeDir(), s1 = s2.replace(/num_files="\d+"/g, 'num_files="[NUM]"').replace(/duration_ms="\d+"/g, 'duration_ms="[DURATION]"').replace(/cost_usd="\d+"/g, 'cost_usd="[COST]"').replaceAll(configHome, "[CONFIG_HOME]").replaceAll(cwd2, "[CWD]").replace(/Available commands:.+/, "Available commands: [COMMANDS]");
  if (process.platform === "win32") {
    let cwdFwd = cwd2.replaceAll("\\", "/"), configHomeFwd = configHome.replaceAll("\\", "/"), cwdJsonEscaped = jsonStringify(cwd2).slice(1, -1), configHomeJsonEscaped = jsonStringify(configHome).slice(1, -1);
    s1 = s1.replaceAll(cwdJsonEscaped, "[CWD]").replaceAll(configHomeJsonEscaped, "[CONFIG_HOME]").replaceAll(cwdFwd, "[CWD]").replaceAll(configHomeFwd, "[CONFIG_HOME]");
  }
  if (s1 = s1.replace(/\[CWD\][^\s"'<>]*/g, (match) => match.replaceAll("\\\\", "/").replaceAll("\\", "/")).replace(/\[CONFIG_HOME\][^\s"'<>]*/g, (match) => match.replaceAll("\\\\", "/").replaceAll("\\", "/")), s1.includes("Files modified by user:"))
    return "Files modified by user: [FILES]";
  return s1;
}
function hydrateValue(s2) {
  if (typeof s2 !== "string")
    return s2;
  return s2.replaceAll("[NUM]", "1").replaceAll("[DURATION]", "100").replaceAll("[CONFIG_HOME]", getClaudeConfigHomeDir()).replaceAll("[CWD]", getCwd());
}
async function* withStreamingVCR(messages, f) {
  if (!shouldUseVCR())
    return yield* f();
  let buffer = [], cachedBuffer = await withVCR(messages, async () => {
    for await (let message of f())
      buffer.push(message);
    return buffer;
  });
  if (cachedBuffer.length > 0) {
    yield* cachedBuffer;
    return;
  }
  yield* buffer;
}
async function withTokenCountVCR(messages, tools, f) {
  let cwdSlug = getCwd().replace(/[^a-zA-Z0-9]/g, "-"), dehydrated = dehydrateValue(jsonStringify({ messages, tools })).replaceAll(cwdSlug, "[CWD_SLUG]").replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[UUID]").replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?/g, "[TIMESTAMP]");
  return (await withFixture(dehydrated, "token-count", async () => ({
    tokenCount: await f()
  }))).tokenCount;
}
var init_vcr = __esm(() => {
  init_isPlainObject();
  init_mapValues();
  init_cost_tracker();
  init_modelCost();
  init_cwd2();
  init_env();
  init_envUtils();
  init_errors();
  init_messages3();
  init_slowOperations();
});

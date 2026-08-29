// Original: src/services/voiceStreamSTT.ts
var exports_voiceStreamSTT = {};
__export(exports_voiceStreamSTT, {
  isVoiceStreamAvailable: () => isVoiceStreamAvailable,
  connectVoiceStream: () => connectVoiceStream,
  FINALIZE_TIMEOUTS_MS: () => FINALIZE_TIMEOUTS_MS
});
import WebSocket2 from "ws";
function isVoiceStreamAvailable() {
  if (!isAnthropicAuthEnabled())
    return !1;
  let tokens = getClaudeAIOAuthTokens();
  return tokens !== null && tokens.accessToken !== null;
}
async function connectVoiceStream(callbacks, options2) {
  await checkAndRefreshOAuthTokenIfNeeded();
  let tokens = getClaudeAIOAuthTokens();
  if (!tokens?.accessToken)
    return logForDebugging("[voice_stream] No OAuth token available"), null;
  let wsBaseUrl = process.env.VOICE_STREAM_BASE_URL || getOauthConfig().BASE_API_URL.replace("https://", "wss://").replace("http://", "ws://");
  if (process.env.VOICE_STREAM_BASE_URL)
    logForDebugging(`[voice_stream] Using VOICE_STREAM_BASE_URL override: ${process.env.VOICE_STREAM_BASE_URL}`);
  let params = new URLSearchParams({
    encoding: "linear16",
    sample_rate: "16000",
    channels: "1",
    endpointing_ms: "300",
    utterance_end_ms: "1000",
    language: options2?.language ?? "en"
  }), isNova3 = !1;
  if (options2?.keyterms?.length)
    for (let term of options2.keyterms)
      params.append("keyterms", term);
  let url3 = `${wsBaseUrl}${VOICE_STREAM_PATH}?${params.toString()}`;
  logForDebugging(`[voice_stream] Connecting to ${url3}`);
  let headers = {
    Authorization: `Bearer ${tokens.accessToken}`,
    "User-Agent": getUserAgent(),
    "x-app": "cli"
  }, tlsOptions = getWebSocketTLSOptions(), wsOptions = typeof Bun < "u" ? {
    headers,
    proxy: getWebSocketProxyUrl(url3),
    tls: tlsOptions || void 0
  } : { headers, agent: getWebSocketProxyAgent(url3), ...tlsOptions }, ws = new WebSocket2(url3, wsOptions), keepaliveTimer = null, connected = !1, finalized = !1, finalizing = !1, upgradeRejected = !1, resolveFinalize = null, cancelNoDataTimer = null, connection7 = {
    send(audioChunk) {
      if (ws.readyState !== WebSocket2.OPEN)
        return;
      if (finalized) {
        logForDebugging(`[voice_stream] Dropping audio chunk after CloseStream: ${String(audioChunk.length)} bytes`);
        return;
      }
      logForDebugging(`[voice_stream] Sending audio chunk: ${String(audioChunk.length)} bytes`), ws.send(Buffer.from(audioChunk));
    },
    finalize() {
      if (finalizing || finalized)
        return Promise.resolve("ws_already_closed");
      return finalizing = !0, new Promise((resolve44) => {
        let safetyTimer = setTimeout(() => resolveFinalize?.("safety_timeout"), FINALIZE_TIMEOUTS_MS.safety), noDataTimer = setTimeout(() => resolveFinalize?.("no_data_timeout"), FINALIZE_TIMEOUTS_MS.noData);
        if (cancelNoDataTimer = () => {
          clearTimeout(noDataTimer), cancelNoDataTimer = null;
        }, resolveFinalize = (source) => {
          if (clearTimeout(safetyTimer), clearTimeout(noDataTimer), resolveFinalize = null, cancelNoDataTimer = null, lastTranscriptText) {
            logForDebugging(`[voice_stream] Promoting unreported interim before ${source} resolve`);
            let t2 = lastTranscriptText;
            lastTranscriptText = "", callbacks.onTranscript(t2, !0);
          }
          logForDebugging(`[voice_stream] Finalize resolved via ${source}`), resolve44(source);
        }, ws.readyState === WebSocket2.CLOSED || ws.readyState === WebSocket2.CLOSING) {
          resolveFinalize("ws_already_closed");
          return;
        }
        setTimeout(() => {
          if (finalized = !0, ws.readyState === WebSocket2.OPEN)
            logForDebugging("[voice_stream] Sending CloseStream (finalize)"), ws.send(CLOSE_STREAM_MSG);
        }, 0);
      });
    },
    close() {
      if (finalized = !0, keepaliveTimer)
        clearInterval(keepaliveTimer), keepaliveTimer = null;
      if (connected = !1, ws.readyState === WebSocket2.OPEN)
        ws.close();
    },
    isConnected() {
      return connected && ws.readyState === WebSocket2.OPEN;
    }
  };
  ws.on("open", () => {
    logForDebugging("[voice_stream] WebSocket connected"), connected = !0, logForDebugging("[voice_stream] Sending initial KeepAlive"), ws.send(KEEPALIVE_MSG), keepaliveTimer = setInterval((ws2) => {
      if (ws2.readyState === WebSocket2.OPEN)
        logForDebugging("[voice_stream] Sending periodic KeepAlive"), ws2.send(KEEPALIVE_MSG);
    }, KEEPALIVE_INTERVAL_MS, ws), callbacks.onReady(connection7);
  });
  let lastTranscriptText = "";
  return ws.on("message", (raw) => {
    let text2 = raw.toString();
    logForDebugging(`[voice_stream] Message received (${String(text2.length)} chars): ${text2.slice(0, 200)}`);
    let msg;
    try {
      msg = jsonParse(text2);
    } catch {
      return;
    }
    switch (msg.type) {
      case "TranscriptText": {
        let transcript = msg.data;
        if (logForDebugging(`[voice_stream] TranscriptText: "${transcript ?? ""}"`), finalized)
          cancelNoDataTimer?.();
        if (transcript) {
          if (!isNova3 && lastTranscriptText) {
            let prev = lastTranscriptText.trimStart(), next2 = transcript.trimStart();
            if (prev && next2 && !next2.startsWith(prev) && !prev.startsWith(next2))
              logForDebugging(`[voice_stream] Auto-finalizing previous segment (new segment detected): "${lastTranscriptText}"`), callbacks.onTranscript(lastTranscriptText, !0);
          }
          lastTranscriptText = transcript, callbacks.onTranscript(transcript, !1);
        }
        break;
      }
      case "TranscriptEndpoint": {
        logForDebugging(`[voice_stream] TranscriptEndpoint received, lastTranscriptText="${lastTranscriptText}"`);
        let finalText = lastTranscriptText;
        if (lastTranscriptText = "", finalText)
          callbacks.onTranscript(finalText, !0);
        if (finalized)
          resolveFinalize?.("post_closestream_endpoint");
        break;
      }
      case "TranscriptError": {
        let desc = msg.description ?? msg.error_code ?? "unknown transcription error";
        if (logForDebugging(`[voice_stream] TranscriptError: ${desc}`), !finalizing)
          callbacks.onError(desc);
        break;
      }
      case "error": {
        let errorDetail = msg.message ?? jsonStringify(msg);
        if (logForDebugging(`[voice_stream] Server error: ${errorDetail}`), !finalizing)
          callbacks.onError(errorDetail);
        break;
      }
      default:
        break;
    }
  }), ws.on("close", (code, reason) => {
    let reasonStr = reason?.toString() ?? "";
    if (logForDebugging(`[voice_stream] WebSocket closed: code=${String(code)} reason="${reasonStr}"`), connected = !1, keepaliveTimer)
      clearInterval(keepaliveTimer), keepaliveTimer = null;
    if (lastTranscriptText) {
      logForDebugging("[voice_stream] Promoting unreported interim transcript to final on close");
      let finalText = lastTranscriptText;
      lastTranscriptText = "", callbacks.onTranscript(finalText, !0);
    }
    if (resolveFinalize?.("ws_close"), !finalizing && !upgradeRejected && code !== 1000 && code !== 1005)
      callbacks.onError(`Connection closed: code ${String(code)}${reasonStr ? ` \u2014 ${reasonStr}` : ""}`);
    callbacks.onClose();
  }), ws.on("unexpected-response", (req, res) => {
    let status2 = res.statusCode ?? 0;
    if (status2 === 101) {
      logForDebugging("[voice_stream] unexpected-response fired with 101; ignoring");
      return;
    }
    if (logForDebugging(`[voice_stream] Upgrade rejected: status=${String(status2)} cf-mitigated=${String(res.headers["cf-mitigated"])} cf-ray=${String(res.headers["cf-ray"])}`), upgradeRejected = !0, res.resume(), req.destroy(), finalizing)
      return;
    callbacks.onError(`WebSocket upgrade rejected with HTTP ${String(status2)}`, { fatal: status2 >= 400 && status2 < 500 });
  }), ws.on("error", (err2) => {
    if (logError2(err2), logForDebugging(`[voice_stream] WebSocket error: ${err2.message}`), !finalizing)
      callbacks.onError(`Voice stream connection error: ${err2.message}`);
  }), connection7;
}
var KEEPALIVE_MSG = '{"type":"KeepAlive"}', CLOSE_STREAM_MSG = '{"type":"CloseStream"}', VOICE_STREAM_PATH = "/api/ws/speech_to_text/voice_stream", KEEPALIVE_INTERVAL_MS = 8000, FINALIZE_TIMEOUTS_MS;
var init_voiceStreamSTT = __esm(() => {
  init_oauth();
  init_auth14();
  init_debug();
  init_http6();
  init_log3();
  init_mtls();
  init_proxy();
  init_slowOperations();
  FINALIZE_TIMEOUTS_MS = {
    safety: 5000,
    noData: 1500
  };
});

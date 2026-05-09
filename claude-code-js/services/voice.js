// Original: src/services/voice.ts
var exports_voice2 = {};
__export(exports_voice2, {
  stopRecording: () => stopRecording,
  startRecording: () => startRecording,
  requestMicrophonePermission: () => requestMicrophonePermission,
  checkVoiceDependencies: () => checkVoiceDependencies,
  checkRecordingAvailability: () => checkRecordingAvailability,
  _resetArecordProbeForTesting: () => _resetArecordProbeForTesting,
  _resetAlsaCardsForTesting: () => _resetAlsaCardsForTesting
});
import { spawn as spawn10, spawnSync as spawnSync5 } from "child_process";
import { readFile as readFile49 } from "fs/promises";
function loadAudioNapi() {
  return audioNapiPromise ??= (async () => {
    try {
      let mod = await import("audio-capture-napi");
      if (typeof mod.isNativeAudioAvailable !== "function")
        return logForDebugging("[voice] audio-capture-napi missing exports, using fallback"), audioNapi = NAPI_STUB, NAPI_STUB;
      return mod.isNativeAudioAvailable(), audioNapi = mod, logForDebugging("[voice] audio-capture-napi loaded"), mod;
    } catch {
      return logForDebugging("[voice] audio-capture-napi not available, using arecord/SoX fallback"), audioNapi = NAPI_STUB, NAPI_STUB;
    }
  })(), audioNapiPromise;
}
function hasCommand2(cmd) {
  return spawnSync5(cmd, ["--version"], {
    stdio: "ignore",
    timeout: 3000
  }).error === void 0;
}
function probeArecord() {
  return arecordProbe ??= new Promise((resolve44) => {
    let child = spawn10("arecord", [
      "-f",
      "S16_LE",
      "-r",
      String(RECORDING_SAMPLE_RATE),
      "-c",
      String(RECORDING_CHANNELS),
      "-t",
      "raw",
      "/dev/null"
    ], { stdio: ["ignore", "ignore", "pipe"] }), stderr = "";
    child.stderr?.on("data", (chunk2) => {
      stderr += chunk2.toString();
    });
    let timer = setTimeout((c3, r4) => {
      c3.kill("SIGTERM"), r4({ ok: !0, stderr: "" });
    }, 150, child, resolve44);
    child.once("close", (code) => {
      clearTimeout(timer), resolve44({ ok: code === 0, stderr: stderr.trim() });
    }), child.once("error", () => {
      clearTimeout(timer), resolve44({ ok: !1, stderr: "arecord: command not found" });
    });
  }), arecordProbe;
}
function _resetArecordProbeForTesting() {
  arecordProbe = null;
}
function linuxHasAlsaCards() {
  return linuxAlsaCardsMemo ??= readFile49("/proc/asound/cards", "utf8").then((cards) => {
    let c3 = cards.trim();
    return c3 !== "" && !c3.includes("no soundcards");
  }, () => !1), linuxAlsaCardsMemo;
}
function _resetAlsaCardsForTesting() {
  linuxAlsaCardsMemo = null;
}
function detectPackageManager() {
  if (process.platform === "darwin") {
    if (hasCommand2("brew"))
      return {
        cmd: "brew",
        args: ["install", "sox"],
        displayCommand: "brew install sox"
      };
    return null;
  }
  if (process.platform === "linux") {
    if (hasCommand2("apt-get"))
      return {
        cmd: "sudo",
        args: ["apt-get", "install", "-y", "sox"],
        displayCommand: "sudo apt-get install sox"
      };
    if (hasCommand2("dnf"))
      return {
        cmd: "sudo",
        args: ["dnf", "install", "-y", "sox"],
        displayCommand: "sudo dnf install sox"
      };
    if (hasCommand2("pacman"))
      return {
        cmd: "sudo",
        args: ["pacman", "-S", "--noconfirm", "sox"],
        displayCommand: "sudo pacman -S sox"
      };
  }
  return null;
}
async function checkVoiceDependencies() {
  if ((await loadAudioNapi()).isNativeAudioAvailable())
    return { available: !0, missing: [], installCommand: null };
  if (process.platform === "win32")
    return {
      available: !1,
      missing: ["Voice mode requires the native audio module (not loaded)"],
      installCommand: null
    };
  if (process.platform === "linux" && hasCommand2("arecord"))
    return { available: !0, missing: [], installCommand: null };
  let missing = [];
  if (!hasCommand2("rec"))
    missing.push("sox (rec command)");
  let pm = missing.length > 0 ? detectPackageManager() : null;
  return {
    available: missing.length === 0,
    missing,
    installCommand: pm?.displayCommand ?? null
  };
}
async function requestMicrophonePermission() {
  if (!(await loadAudioNapi()).isNativeAudioAvailable())
    return !0;
  if (await startRecording((_chunk) => {}, () => {}, { silenceDetection: !1 }))
    return stopRecording(), !0;
  return !1;
}
async function checkRecordingAvailability() {
  if (isRunningOnHomespace() || isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
    return {
      available: !1,
      reason: `Voice mode requires microphone access, but no audio device is available in this environment.

To use voice mode, run Claude Code locally instead.`
    };
  if ((await loadAudioNapi()).isNativeAudioAvailable())
    return { available: !0, reason: null };
  if (process.platform === "win32")
    return {
      available: !1,
      reason: "Voice recording requires the native audio module, which could not be loaded."
    };
  let wslNoAudioReason = `Voice mode could not access an audio device in WSL.

WSL2 with WSLg (Windows 11) provides audio via PulseAudio \u2014 if you are on Windows 10 or WSL1, run Claude Code in native Windows instead.`;
  if (process.platform === "linux" && hasCommand2("arecord")) {
    let probe = await probeArecord();
    if (probe.ok)
      return { available: !0, reason: null };
    if (getPlatform() === "wsl")
      return { available: !1, reason: wslNoAudioReason };
    logForDebugging(`[voice] arecord probe failed: ${probe.stderr}`);
  }
  if (!hasCommand2("rec")) {
    if (getPlatform() === "wsl")
      return { available: !1, reason: wslNoAudioReason };
    let pm = detectPackageManager();
    return {
      available: !1,
      reason: pm ? `Voice mode requires SoX for audio recording. Install it with: ${pm.displayCommand}` : `Voice mode requires SoX for audio recording. Install SoX manually:
  macOS: brew install sox
  Ubuntu/Debian: sudo apt-get install sox
  Fedora: sudo dnf install sox`
    };
  }
  return { available: !0, reason: null };
}
async function startRecording(onData, onEnd, options2) {
  logForDebugging(`[voice] startRecording called, platform=${process.platform}`);
  let napi = await loadAudioNapi(), nativeAvailable = napi.isNativeAudioAvailable() && (process.platform !== "linux" || await linuxHasAlsaCards()), useSilenceDetection = options2?.silenceDetection !== !1;
  if (nativeAvailable) {
    if (nativeRecordingActive || napi.isNativeRecordingActive())
      napi.stopNativeRecording(), nativeRecordingActive = !1;
    if (napi.startNativeRecording((data) => {
      onData(data);
    }, () => {
      if (useSilenceDetection)
        nativeRecordingActive = !1, onEnd();
    }))
      return nativeRecordingActive = !0, !0;
  }
  if (process.platform === "win32")
    return logForDebugging("[voice] Windows native recording unavailable, no fallback"), !1;
  if (process.platform === "linux" && hasCommand2("arecord") && (await probeArecord()).ok)
    return startArecordRecording(onData, onEnd);
  return startSoxRecording(onData, onEnd, options2);
}
function startSoxRecording(onData, onEnd, options2) {
  let useSilenceDetection = options2?.silenceDetection !== !1, args = [
    "-q",
    "--buffer",
    "1024",
    "-t",
    "raw",
    "-r",
    String(RECORDING_SAMPLE_RATE),
    "-e",
    "signed",
    "-b",
    "16",
    "-c",
    String(RECORDING_CHANNELS),
    "-"
  ];
  if (useSilenceDetection)
    args.push("silence", "1", "0.1", SILENCE_THRESHOLD2, "1", SILENCE_DURATION_SECS, SILENCE_THRESHOLD2);
  let child = spawn10("rec", args, {
    stdio: ["pipe", "pipe", "pipe"]
  });
  return activeRecorder = child, child.stdout?.on("data", (chunk2) => {
    onData(chunk2);
  }), child.stderr?.on("data", () => {}), child.on("close", () => {
    activeRecorder = null, onEnd();
  }), child.on("error", (err2) => {
    logError2(err2), activeRecorder = null, onEnd();
  }), !0;
}
function startArecordRecording(onData, onEnd) {
  let args = [
    "-f",
    "S16_LE",
    "-r",
    String(RECORDING_SAMPLE_RATE),
    "-c",
    String(RECORDING_CHANNELS),
    "-t",
    "raw",
    "-q",
    "-"
  ], child = spawn10("arecord", args, {
    stdio: ["pipe", "pipe", "pipe"]
  });
  return activeRecorder = child, child.stdout?.on("data", (chunk2) => {
    onData(chunk2);
  }), child.stderr?.on("data", () => {}), child.on("close", () => {
    activeRecorder = null, onEnd();
  }), child.on("error", (err2) => {
    logError2(err2), activeRecorder = null, onEnd();
  }), !0;
}
function stopRecording() {
  if (nativeRecordingActive && audioNapi) {
    audioNapi.stopNativeRecording(), nativeRecordingActive = !1;
    return;
  }
  if (activeRecorder)
    activeRecorder.kill("SIGTERM"), activeRecorder = null;
}
var NAPI_STUB, audioNapi = null, audioNapiPromise = null, RECORDING_SAMPLE_RATE = 16000, RECORDING_CHANNELS = 1, SILENCE_DURATION_SECS = "2.0", SILENCE_THRESHOLD2 = "3%", arecordProbe = null, linuxAlsaCardsMemo = null, activeRecorder = null, nativeRecordingActive = !1;
var init_voice2 = __esm(() => {
  init_debug();
  init_envUtils();
  init_log3();
  init_platform();
  NAPI_STUB = {
    isNativeAudioAvailable: () => !1,
    isNativeRecordingActive: () => !1,
    startNativeRecording: () => !1,
    stopNativeRecording: () => {}
  };
});

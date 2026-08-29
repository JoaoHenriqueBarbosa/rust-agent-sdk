// Original: src/utils/fpsTracker.ts
class FpsTracker {
  frameDurations = [];
  firstRenderTime;
  lastRenderTime;
  record(durationMs) {
    let now2 = performance.now();
    if (this.firstRenderTime === void 0)
      this.firstRenderTime = now2;
    this.lastRenderTime = now2, this.frameDurations.push(durationMs);
  }
  getMetrics() {
    if (this.frameDurations.length === 0 || this.firstRenderTime === void 0 || this.lastRenderTime === void 0)
      return;
    let totalTimeMs = this.lastRenderTime - this.firstRenderTime;
    if (totalTimeMs <= 0)
      return;
    let averageFps = this.frameDurations.length / (totalTimeMs / 1000), sorted = this.frameDurations.slice().sort((a2, b) => b - a2), p99Index = Math.max(0, Math.ceil(sorted.length * 0.01) - 1), p99FrameTimeMs = sorted[p99Index], low1PctFps = p99FrameTimeMs > 0 ? 1000 / p99FrameTimeMs : 0;
    return {
      averageFps: Math.round(averageFps * 100) / 100,
      low1PctFps: Math.round(low1PctFps * 100) / 100
    };
  }
}

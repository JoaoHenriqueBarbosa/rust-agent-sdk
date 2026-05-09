// function: createDefaultTracingSpan
function createDefaultTracingSpan() {
  return {
    end: () => {},
    isRecording: () => !1,
    recordException: () => {},
    setAttribute: () => {},
    setStatus: () => {},
    addEvent: () => {}
  };
}

// class: MultiSpanProcessor
class MultiSpanProcessor {
  _spanProcessors;
  constructor(spanProcessors) {
    this._spanProcessors = spanProcessors;
  }
  forceFlush() {
    let promises = [];
    for (let spanProcessor of this._spanProcessors)
      promises.push(spanProcessor.forceFlush());
    return new Promise((resolve26) => {
      Promise.all(promises).then(() => {
        resolve26();
      }).catch((error44) => {
        import_core54.globalErrorHandler(error44 || Error("MultiSpanProcessor: forceFlush failed")), resolve26();
      });
    });
  }
  onStart(span, context6) {
    for (let spanProcessor of this._spanProcessors)
      spanProcessor.onStart(span, context6);
  }
  onEnding(span) {
    for (let spanProcessor of this._spanProcessors)
      if (spanProcessor.onEnding)
        spanProcessor.onEnding(span);
  }
  onEnd(span) {
    for (let spanProcessor of this._spanProcessors)
      spanProcessor.onEnd(span);
  }
  shutdown() {
    let promises = [];
    for (let spanProcessor of this._spanProcessors)
      promises.push(spanProcessor.shutdown());
    return new Promise((resolve26, reject2) => {
      Promise.all(promises).then(() => {
        resolve26();
      }, reject2);
    });
  }
}

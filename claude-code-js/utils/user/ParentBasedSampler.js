// class: ParentBasedSampler
class ParentBasedSampler {
  _root;
  _remoteParentSampled;
  _remoteParentNotSampled;
  _localParentSampled;
  _localParentNotSampled;
  constructor(config10) {
    if (this._root = config10.root, !this._root)
      import_core49.globalErrorHandler(Error("ParentBasedSampler must have a root sampler configured")), this._root = new AlwaysOnSampler;
    this._remoteParentSampled = config10.remoteParentSampled ?? new AlwaysOnSampler, this._remoteParentNotSampled = config10.remoteParentNotSampled ?? new AlwaysOffSampler, this._localParentSampled = config10.localParentSampled ?? new AlwaysOnSampler, this._localParentNotSampled = config10.localParentNotSampled ?? new AlwaysOffSampler;
  }
  shouldSample(context4, traceId, spanName, spanKind, attributes, links) {
    let parentContext = import_api6.trace.getSpanContext(context4);
    if (!parentContext || !import_api6.isSpanContextValid(parentContext))
      return this._root.shouldSample(context4, traceId, spanName, spanKind, attributes, links);
    if (parentContext.isRemote) {
      if (parentContext.traceFlags & import_api6.TraceFlags.SAMPLED)
        return this._remoteParentSampled.shouldSample(context4, traceId, spanName, spanKind, attributes, links);
      return this._remoteParentNotSampled.shouldSample(context4, traceId, spanName, spanKind, attributes, links);
    }
    if (parentContext.traceFlags & import_api6.TraceFlags.SAMPLED)
      return this._localParentSampled.shouldSample(context4, traceId, spanName, spanKind, attributes, links);
    return this._localParentNotSampled.shouldSample(context4, traceId, spanName, spanKind, attributes, links);
  }
  toString() {
    return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
  }
}

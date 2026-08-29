// class: GrowthBook
class GrowthBook {
  constructor(options2) {
    if (options2 = options2 || {}, this.version = SDK_VERSION3, this._options = this.context = options2, this._renderer = options2.renderer || null, this._trackedExperiments = /* @__PURE__ */ new Set, this._completedChangeIds = /* @__PURE__ */ new Set, this._trackedFeatures = {}, this.debug = !!options2.debug, this._subscriptions = /* @__PURE__ */ new Set, this.ready = !1, this._assigned = /* @__PURE__ */ new Map, this._activeAutoExperiments = /* @__PURE__ */ new Map, this._triggeredExpKeys = /* @__PURE__ */ new Set, this._initialized = !1, this._redirectedUrl = "", this._deferredTrackingCalls = /* @__PURE__ */ new Map, this._autoExperimentsAllowed = !options2.disableExperimentsOnLoad, this._destroyCallbacks = [], this.logs = [], this.log = this.log.bind(this), this._saveDeferredTrack = this._saveDeferredTrack.bind(this), this._onExperimentEval = this._onExperimentEval.bind(this), this._fireSubscriptions = this._fireSubscriptions.bind(this), this._recordChangedId = this._recordChangedId.bind(this), options2.remoteEval) {
      if (options2.decryptionKey)
        throw Error("Encryption is not available for remoteEval");
      if (!options2.clientKey)
        throw Error("Missing clientKey");
      let isGbHost = !1;
      try {
        isGbHost = !!new URL(options2.apiHost || "").hostname.match(/growthbook\.io$/i);
      } catch (e) {}
      if (isGbHost)
        throw Error("Cannot use remoteEval on GrowthBook Cloud");
    } else if (options2.cacheKeyAttributes)
      throw Error("cacheKeyAttributes are only used for remoteEval");
    if (options2.stickyBucketService) {
      let s2 = options2.stickyBucketService;
      this._saveStickyBucketAssignmentDoc = (doc2) => {
        return s2.saveAssignments(doc2);
      };
    }
    if (options2.plugins)
      for (let plugin2 of options2.plugins)
        plugin2(this);
    if (options2.features)
      this.ready = !0;
    if (isBrowser2 && options2.enableDevMode)
      window._growthbook = this, document.dispatchEvent(new Event("gbloaded"));
    if (options2.experiments)
      this.ready = !0, this._updateAllAutoExperiments();
    if (this._options.stickyBucketService && this._options.stickyBucketAssignmentDocs)
      for (let key3 in this._options.stickyBucketAssignmentDocs) {
        let doc2 = this._options.stickyBucketAssignmentDocs[key3];
        if (doc2)
          this._options.stickyBucketService.saveAssignments(doc2).catch(() => {});
      }
    if (this.ready)
      this.refreshStickyBuckets(this.getPayload());
  }
  async setPayload(payload) {
    this._payload = payload;
    let data = await decryptPayload(payload, this._options.decryptionKey);
    if (this._decryptedPayload = data, await this.refreshStickyBuckets(data), data.features)
      this._options.features = data.features;
    if (data.savedGroups)
      this._options.savedGroups = data.savedGroups;
    if (data.experiments)
      this._options.experiments = data.experiments, this._updateAllAutoExperiments();
    this.ready = !0, this._render();
  }
  initSync(options2) {
    this._initialized = !0;
    let payload = options2.payload;
    if (payload.encryptedExperiments || payload.encryptedFeatures)
      throw Error("initSync does not support encrypted payloads");
    if (this._options.stickyBucketService && !this._options.stickyBucketAssignmentDocs)
      this._options.stickyBucketAssignmentDocs = this.generateStickyBucketAssignmentDocsSync(this._options.stickyBucketService, payload);
    if (this._payload = payload, this._decryptedPayload = payload, payload.features)
      this._options.features = payload.features;
    if (payload.experiments)
      this._options.experiments = payload.experiments, this._updateAllAutoExperiments();
    return this.ready = !0, startStreaming(this, options2), this;
  }
  async init(options2) {
    if (this._initialized = !0, options2 = options2 || {}, options2.cacheSettings)
      configureCache(options2.cacheSettings);
    if (options2.payload)
      return await this.setPayload(options2.payload), startStreaming(this, options2), {
        success: !0,
        source: "init"
      };
    else {
      let {
        data,
        ...res
      } = await this._refresh({
        ...options2,
        allowStale: !0
      });
      return startStreaming(this, options2), await this.setPayload(data || {}), res;
    }
  }
  async loadFeatures(options2) {
    options2 = options2 || {}, await this.init({
      skipCache: options2.skipCache,
      timeout: options2.timeout,
      streaming: (this._options.backgroundSync ?? !0) && (options2.autoRefresh || this._options.subscribeToChanges)
    });
  }
  async refreshFeatures(options2) {
    let res = await this._refresh({
      ...options2 || {},
      allowStale: !1
    });
    if (res.data)
      await this.setPayload(res.data);
  }
  getApiInfo() {
    return [this.getApiHosts().apiHost, this.getClientKey()];
  }
  getApiHosts() {
    return getApiHosts(this._options);
  }
  getClientKey() {
    return this._options.clientKey || "";
  }
  getPayload() {
    return this._payload || {
      features: this.getFeatures(),
      experiments: this.getExperiments()
    };
  }
  getDecryptedPayload() {
    return this._decryptedPayload || this.getPayload();
  }
  isRemoteEval() {
    return this._options.remoteEval || !1;
  }
  getCacheKeyAttributes() {
    return this._options.cacheKeyAttributes;
  }
  async _refresh({
    timeout,
    skipCache,
    allowStale,
    streaming: streaming2
  }) {
    if (!this._options.clientKey)
      throw Error("Missing clientKey");
    return refreshFeatures({
      instance: this,
      timeout,
      skipCache: skipCache || this._options.disableCache,
      allowStale,
      backgroundSync: streaming2 ?? this._options.backgroundSync ?? !0
    });
  }
  _render() {
    if (this._renderer)
      try {
        this._renderer();
      } catch (e) {
        console.error("Failed to render", e);
      }
  }
  setFeatures(features) {
    this._options.features = features, this.ready = !0, this._render();
  }
  async setEncryptedFeatures(encryptedString, decryptionKey, subtle) {
    let featuresJSON = await decrypt(encryptedString, decryptionKey || this._options.decryptionKey, subtle);
    this.setFeatures(JSON.parse(featuresJSON));
  }
  setExperiments(experiments) {
    this._options.experiments = experiments, this.ready = !0, this._updateAllAutoExperiments();
  }
  async setEncryptedExperiments(encryptedString, decryptionKey, subtle) {
    let experimentsJSON = await decrypt(encryptedString, decryptionKey || this._options.decryptionKey, subtle);
    this.setExperiments(JSON.parse(experimentsJSON));
  }
  async setAttributes(attributes2) {
    if (this._options.attributes = attributes2, this._options.stickyBucketService)
      await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return;
    }
    this._render(), this._updateAllAutoExperiments();
  }
  async updateAttributes(attributes2) {
    return this.setAttributes({
      ...this._options.attributes,
      ...attributes2
    });
  }
  async setAttributeOverrides(overrides) {
    if (this._options.attributeOverrides = overrides, this._options.stickyBucketService)
      await this.refreshStickyBuckets();
    if (this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return;
    }
    this._render(), this._updateAllAutoExperiments();
  }
  async setForcedVariations(vars) {
    if (this._options.forcedVariations = vars || {}, this._options.remoteEval) {
      await this._refreshForRemoteEval();
      return;
    }
    this._render(), this._updateAllAutoExperiments();
  }
  setForcedFeatures(map8) {
    this._options.forcedFeatureValues = map8, this._render();
  }
  async setURL(url3) {
    if (url3 === this._options.url)
      return;
    if (this._options.url = url3, this._redirectedUrl = "", this._options.remoteEval) {
      await this._refreshForRemoteEval(), this._updateAllAutoExperiments(!0);
      return;
    }
    this._updateAllAutoExperiments(!0);
  }
  getAttributes() {
    return {
      ...this._options.attributes,
      ...this._options.attributeOverrides
    };
  }
  getForcedVariations() {
    return this._options.forcedVariations || {};
  }
  getForcedFeatures() {
    return this._options.forcedFeatureValues || /* @__PURE__ */ new Map;
  }
  getStickyBucketAssignmentDocs() {
    return this._options.stickyBucketAssignmentDocs || {};
  }
  getUrl() {
    return this._options.url || "";
  }
  getFeatures() {
    return this._options.features || {};
  }
  getExperiments() {
    return this._options.experiments || [];
  }
  getCompletedChangeIds() {
    return Array.from(this._completedChangeIds);
  }
  subscribe(cb) {
    return this._subscriptions.add(cb), () => {
      this._subscriptions.delete(cb);
    };
  }
  async _refreshForRemoteEval() {
    if (!this._options.remoteEval)
      return;
    if (!this._initialized)
      return;
    let res = await this._refresh({
      allowStale: !1
    });
    if (res.data)
      await this.setPayload(res.data);
  }
  getAllResults() {
    return new Map(this._assigned);
  }
  onDestroy(cb) {
    this._destroyCallbacks.push(cb);
  }
  isDestroyed() {
    return !!this._destroyed;
  }
  destroy(options2) {
    if (options2 = options2 || {}, this._destroyed = !0, this._destroyCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    }), this._subscriptions.clear(), this._assigned.clear(), this._trackedExperiments.clear(), this._completedChangeIds.clear(), this._deferredTrackingCalls.clear(), this._trackedFeatures = {}, this._destroyCallbacks = [], this._payload = void 0, this._saveStickyBucketAssignmentDoc = void 0, unsubscribe(this), options2.destroyAllStreams)
      clearAutoRefresh();
    if (this.logs = [], isBrowser2 && window._growthbook === this)
      delete window._growthbook;
    this._activeAutoExperiments.forEach((exp) => {
      exp.undo();
    }), this._activeAutoExperiments.clear(), this._triggeredExpKeys.clear();
  }
  setRenderer(renderer) {
    this._renderer = renderer;
  }
  forceVariation(key3, variation) {
    if (this._options.forcedVariations = this._options.forcedVariations || {}, this._options.forcedVariations[key3] = variation, this._options.remoteEval) {
      this._refreshForRemoteEval();
      return;
    }
    this._updateAllAutoExperiments(), this._render();
  }
  run(experiment) {
    let {
      result
    } = runExperiment(experiment, null, this._getEvalContext());
    return this._onExperimentEval(experiment, result), result;
  }
  triggerExperiment(key3) {
    if (this._triggeredExpKeys.add(key3), !this._options.experiments)
      return null;
    return this._options.experiments.filter((exp) => exp.key === key3).map((exp) => {
      return this._runAutoExperiment(exp);
    }).filter((res) => res !== null);
  }
  triggerAutoExperiments() {
    this._autoExperimentsAllowed = !0, this._updateAllAutoExperiments(!0);
  }
  _getEvalContext() {
    return {
      user: this._getUserContext(),
      global: this._getGlobalContext(),
      stack: {
        evaluatedFeatures: /* @__PURE__ */ new Set
      }
    };
  }
  _getUserContext() {
    return {
      attributes: this._options.user ? {
        ...this._options.user,
        ...this._options.attributes
      } : this._options.attributes,
      enableDevMode: this._options.enableDevMode,
      blockedChangeIds: this._options.blockedChangeIds,
      stickyBucketAssignmentDocs: this._options.stickyBucketAssignmentDocs,
      url: this._getContextUrl(),
      forcedVariations: this._options.forcedVariations,
      forcedFeatureValues: this._options.forcedFeatureValues,
      attributeOverrides: this._options.attributeOverrides,
      saveStickyBucketAssignmentDoc: this._saveStickyBucketAssignmentDoc,
      trackingCallback: this._options.trackingCallback,
      onFeatureUsage: this._options.onFeatureUsage,
      devLogs: this.logs,
      trackedExperiments: this._trackedExperiments,
      trackedFeatureUsage: this._trackedFeatures
    };
  }
  _getGlobalContext() {
    return {
      features: this._options.features,
      experiments: this._options.experiments,
      log: this.log,
      enabled: this._options.enabled,
      qaMode: this._options.qaMode,
      savedGroups: this._options.savedGroups,
      groups: this._options.groups,
      overrides: this._options.overrides,
      onExperimentEval: this._onExperimentEval,
      recordChangeId: this._recordChangedId,
      saveDeferredTrack: this._saveDeferredTrack,
      eventLogger: this._options.eventLogger
    };
  }
  _runAutoExperiment(experiment, forceRerun) {
    let existing = this._activeAutoExperiments.get(experiment);
    if (experiment.manual && !this._triggeredExpKeys.has(experiment.key) && !existing)
      return null;
    let isBlocked = this._isAutoExperimentBlockedByContext(experiment);
    if (isBlocked)
      this.log("Auto experiment blocked", {
        id: experiment.key
      });
    let result, trackingCall;
    if (isBlocked)
      result = getExperimentResult(this._getEvalContext(), experiment, -1, !1, "");
    else
      ({
        result,
        trackingCall
      } = runExperiment(experiment, null, this._getEvalContext())), this._onExperimentEval(experiment, result);
    let valueHash = JSON.stringify(result.value);
    if (!forceRerun && result.inExperiment && existing && existing.valueHash === valueHash)
      return result;
    if (existing)
      this._undoActiveAutoExperiment(experiment);
    if (result.inExperiment) {
      let changeType = getAutoExperimentChangeType(experiment);
      if (changeType === "redirect" && result.value.urlRedirect && experiment.urlPatterns) {
        let url3 = experiment.persistQueryString ? mergeQueryStrings(this._getContextUrl(), result.value.urlRedirect) : result.value.urlRedirect;
        if (isURLTargeted(url3, experiment.urlPatterns))
          return this.log("Skipping redirect because original URL matches redirect URL", {
            id: experiment.key
          }), result;
        this._redirectedUrl = url3;
        let {
          navigate,
          delay: delay4
        } = this._getNavigateFunction();
        if (navigate)
          if (isBrowser2)
            Promise.all([...trackingCall ? [promiseTimeout(trackingCall, this._options.maxNavigateDelay ?? 1000)] : [], new Promise((resolve45) => window.setTimeout(resolve45, this._options.navigateDelay ?? delay4))]).then(() => {
              try {
                navigate(url3);
              } catch (e) {
                console.error(e);
              }
            });
          else
            try {
              navigate(url3);
            } catch (e) {
              console.error(e);
            }
      } else if (changeType === "visual") {
        let undo = this._options.applyDomChangesCallback ? this._options.applyDomChangesCallback(result.value) : this._applyDOMChanges(result.value);
        if (undo)
          this._activeAutoExperiments.set(experiment, {
            undo,
            valueHash
          });
      }
    }
    return result;
  }
  _undoActiveAutoExperiment(exp) {
    let data = this._activeAutoExperiments.get(exp);
    if (data)
      data.undo(), this._activeAutoExperiments.delete(exp);
  }
  _updateAllAutoExperiments(forceRerun) {
    if (!this._autoExperimentsAllowed)
      return;
    let experiments = this._options.experiments || [], keys3 = new Set(experiments);
    this._activeAutoExperiments.forEach((v2, k3) => {
      if (!keys3.has(k3))
        v2.undo(), this._activeAutoExperiments.delete(k3);
    });
    for (let exp of experiments) {
      let result = this._runAutoExperiment(exp, forceRerun);
      if (result && result.inExperiment && getAutoExperimentChangeType(exp) === "redirect")
        break;
    }
  }
  _onExperimentEval(experiment, result) {
    let prev = this._assigned.get(experiment.key);
    if (this._assigned.set(experiment.key, {
      experiment,
      result
    }), this._subscriptions.size > 0)
      this._fireSubscriptions(experiment, result, prev);
  }
  _fireSubscriptions(experiment, result, prev) {
    if (!prev || prev.result.inExperiment !== result.inExperiment || prev.result.variationId !== result.variationId)
      this._subscriptions.forEach((cb) => {
        try {
          cb(experiment, result);
        } catch (e) {
          console.error(e);
        }
      });
  }
  _recordChangedId(id) {
    this._completedChangeIds.add(id);
  }
  isOn(key3) {
    return this.evalFeature(key3).on;
  }
  isOff(key3) {
    return this.evalFeature(key3).off;
  }
  getFeatureValue(key3, defaultValue) {
    let value = this.evalFeature(key3).value;
    return value === null ? defaultValue : value;
  }
  feature(id) {
    return this.evalFeature(id);
  }
  evalFeature(id) {
    return evalFeature(id, this._getEvalContext());
  }
  log(msg, ctx) {
    if (!this.debug)
      return;
    if (this._options.log)
      this._options.log(msg, ctx);
    else
      console.log(msg, ctx);
  }
  getDeferredTrackingCalls() {
    return Array.from(this._deferredTrackingCalls.values());
  }
  setDeferredTrackingCalls(calls) {
    this._deferredTrackingCalls = new Map(calls.filter((c3) => c3 && c3.experiment && c3.result).map((c3) => {
      return [getExperimentDedupeKey(c3.experiment, c3.result), c3];
    }));
  }
  async fireDeferredTrackingCalls() {
    if (!this._options.trackingCallback)
      return;
    let promises = [];
    this._deferredTrackingCalls.forEach((call70) => {
      if (!call70 || !call70.experiment || !call70.result)
        console.error("Invalid deferred tracking call", {
          call: call70
        });
      else
        promises.push(this._options.trackingCallback(call70.experiment, call70.result));
    }), this._deferredTrackingCalls.clear(), await Promise.all(promises);
  }
  setTrackingCallback(callback) {
    this._options.trackingCallback = callback, this.fireDeferredTrackingCalls();
  }
  setFeatureUsageCallback(callback) {
    this._options.onFeatureUsage = callback;
  }
  setEventLogger(logger34) {
    this._options.eventLogger = logger34;
  }
  async logEvent(eventName, properties) {
    if (this._destroyed) {
      console.error("Cannot log event to destroyed GrowthBook instance");
      return;
    }
    if (this._options.enableDevMode)
      this.logs.push({
        eventName,
        properties,
        timestamp: Date.now().toString(),
        logType: "event"
      });
    if (this._options.eventLogger)
      try {
        await this._options.eventLogger(eventName, properties || {}, this._getUserContext());
      } catch (e) {
        console.error(e);
      }
    else
      console.error("No event logger configured");
  }
  _saveDeferredTrack(data) {
    this._deferredTrackingCalls.set(getExperimentDedupeKey(data.experiment, data.result), data);
  }
  _getContextUrl() {
    return this._options.url || (isBrowser2 ? window.location.href : "");
  }
  _isAutoExperimentBlockedByContext(experiment) {
    let changeType = getAutoExperimentChangeType(experiment);
    if (changeType === "visual") {
      if (this._options.disableVisualExperiments)
        return !0;
      if (this._options.disableJsInjection) {
        if (experiment.variations.some((v2) => v2.js))
          return !0;
      }
    } else if (changeType === "redirect") {
      if (this._options.disableUrlRedirectExperiments)
        return !0;
      try {
        let current = new URL(this._getContextUrl());
        for (let v2 of experiment.variations) {
          if (!v2 || !v2.urlRedirect)
            continue;
          let url3 = new URL(v2.urlRedirect);
          if (this._options.disableCrossOriginUrlRedirectExperiments) {
            if (url3.protocol !== current.protocol)
              return !0;
            if (url3.host !== current.host)
              return !0;
          }
        }
      } catch (e) {
        return this.log("Error parsing current or redirect URL", {
          id: experiment.key,
          error: e
        }), !0;
      }
    } else
      return !0;
    if (experiment.changeId && (this._options.blockedChangeIds || []).includes(experiment.changeId))
      return !0;
    return !1;
  }
  getRedirectUrl() {
    return this._redirectedUrl;
  }
  _getNavigateFunction() {
    if (this._options.navigate)
      return {
        navigate: this._options.navigate,
        delay: 0
      };
    else if (isBrowser2)
      return {
        navigate: (url3) => {
          window.location.replace(url3);
        },
        delay: 100
      };
    return {
      navigate: null,
      delay: 0
    };
  }
  _applyDOMChanges(changes) {
    if (!isBrowser2)
      return;
    let undo = [];
    if (changes.css) {
      let s2 = document.createElement("style");
      s2.innerHTML = changes.css, document.head.appendChild(s2), undo.push(() => s2.remove());
    }
    if (changes.js) {
      let script = document.createElement("script");
      if (script.innerHTML = changes.js, this._options.jsInjectionNonce)
        script.nonce = this._options.jsInjectionNonce;
      document.head.appendChild(script), undo.push(() => script.remove());
    }
    if (changes.domMutations)
      changes.domMutations.forEach((mutation) => {
        undo.push(dom_mutator_esm_default.declarative(mutation).revert);
      });
    return () => {
      undo.forEach((fn) => fn());
    };
  }
  async refreshStickyBuckets(data) {
    if (this._options.stickyBucketService) {
      let ctx = this._getEvalContext(), docs = await getAllStickyBucketAssignmentDocs(ctx, this._options.stickyBucketService, data);
      this._options.stickyBucketAssignmentDocs = docs;
    }
  }
  generateStickyBucketAssignmentDocsSync(stickyBucketService, payload) {
    if (!("getAllAssignmentsSync" in stickyBucketService)) {
      console.error("generating StickyBucketAssignmentDocs docs requires StickyBucketServiceSync");
      return;
    }
    let ctx = this._getEvalContext(), attributes2 = getStickyBucketAttributes(ctx, payload);
    return stickyBucketService.getAllAssignmentsSync(attributes2);
  }
  inDevMode() {
    return !!this._options.enableDevMode;
  }
}

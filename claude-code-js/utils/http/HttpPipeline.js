// class: HttpPipeline
class HttpPipeline {
  _policies = [];
  _orderedPolicies;
  constructor(policies) {
    this._policies = policies?.slice(0) ?? [], this._orderedPolicies = void 0;
  }
  addPolicy(policy, options = {}) {
    if (options.phase && options.afterPhase)
      throw Error("Policies inside a phase cannot specify afterPhase.");
    if (options.phase && !ValidPhaseNames.has(options.phase))
      throw Error(`Invalid phase name: ${options.phase}`);
    if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase))
      throw Error(`Invalid afterPhase name: ${options.afterPhase}`);
    this._policies.push({
      policy,
      options
    }), this._orderedPolicies = void 0;
  }
  removePolicy(options) {
    let removedPolicies = [];
    return this._policies = this._policies.filter((policyDescriptor) => {
      if (options.name && policyDescriptor.policy.name === options.name || options.phase && policyDescriptor.options.phase === options.phase)
        return removedPolicies.push(policyDescriptor.policy), !1;
      else
        return !0;
    }), this._orderedPolicies = void 0, removedPolicies;
  }
  sendRequest(httpClient, request2) {
    return this.getOrderedPolicies().reduceRight((next, policy) => {
      return (req) => {
        return policy.sendRequest(req, next);
      };
    }, (req) => httpClient.sendRequest(req))(request2);
  }
  getOrderedPolicies() {
    if (!this._orderedPolicies)
      this._orderedPolicies = this.orderPolicies();
    return this._orderedPolicies;
  }
  clone() {
    return new HttpPipeline(this._policies);
  }
  static create() {
    return new HttpPipeline;
  }
  orderPolicies() {
    let result = [], policyMap = /* @__PURE__ */ new Map;
    function createPhase(name3) {
      return {
        name: name3,
        policies: /* @__PURE__ */ new Set,
        hasRun: !1,
        hasAfterPolicies: !1
      };
    }
    let serializePhase = createPhase("Serialize"), noPhase = createPhase("None"), deserializePhase = createPhase("Deserialize"), retryPhase = createPhase("Retry"), signPhase = createPhase("Sign"), orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
    function getPhase(phase) {
      if (phase === "Retry")
        return retryPhase;
      else if (phase === "Serialize")
        return serializePhase;
      else if (phase === "Deserialize")
        return deserializePhase;
      else if (phase === "Sign")
        return signPhase;
      else
        return noPhase;
    }
    for (let descriptor of this._policies) {
      let { policy, options } = descriptor, policyName = policy.name;
      if (policyMap.has(policyName))
        throw Error("Duplicate policy names not allowed in pipeline");
      let node = {
        policy,
        dependsOn: /* @__PURE__ */ new Set,
        dependants: /* @__PURE__ */ new Set
      };
      if (options.afterPhase)
        node.afterPhase = getPhase(options.afterPhase), node.afterPhase.hasAfterPolicies = !0;
      policyMap.set(policyName, node), getPhase(options.phase).policies.add(node);
    }
    for (let descriptor of this._policies) {
      let { policy, options } = descriptor, policyName = policy.name, node = policyMap.get(policyName);
      if (!node)
        throw Error(`Missing node for policy ${policyName}`);
      if (options.afterPolicies)
        for (let afterPolicyName of options.afterPolicies) {
          let afterNode = policyMap.get(afterPolicyName);
          if (afterNode)
            node.dependsOn.add(afterNode), afterNode.dependants.add(node);
        }
      if (options.beforePolicies)
        for (let beforePolicyName of options.beforePolicies) {
          let beforeNode = policyMap.get(beforePolicyName);
          if (beforeNode)
            beforeNode.dependsOn.add(node), node.dependants.add(beforeNode);
        }
    }
    function walkPhase(phase) {
      phase.hasRun = !0;
      for (let node of phase.policies) {
        if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size))
          continue;
        if (node.dependsOn.size === 0) {
          result.push(node.policy);
          for (let dependant of node.dependants)
            dependant.dependsOn.delete(node);
          policyMap.delete(node.policy.name), phase.policies.delete(node);
        }
      }
    }
    function walkPhases() {
      for (let phase of orderedPhases) {
        if (walkPhase(phase), phase.policies.size > 0 && phase !== noPhase) {
          if (!noPhase.hasRun)
            walkPhase(noPhase);
          return;
        }
        if (phase.hasAfterPolicies)
          walkPhase(noPhase);
      }
    }
    let iteration = 0;
    while (policyMap.size > 0) {
      iteration++;
      let initialResultLength = result.length;
      if (walkPhases(), result.length <= initialResultLength && iteration > 1)
        throw Error("Cannot satisfy policy dependencies due to requirements cycle.");
    }
    return result;
  }
}

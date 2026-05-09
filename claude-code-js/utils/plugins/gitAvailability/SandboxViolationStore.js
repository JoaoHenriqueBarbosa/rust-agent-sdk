// class: SandboxViolationStore
class SandboxViolationStore {
  constructor() {
    this.violations = [], this.totalCount = 0, this.maxSize = 100, this.listeners = /* @__PURE__ */ new Set;
  }
  addViolation(violation) {
    if (this.violations.push(violation), this.totalCount++, this.violations.length > this.maxSize)
      this.violations = this.violations.slice(-this.maxSize);
    this.notifyListeners();
  }
  getViolations(limit) {
    if (limit === void 0)
      return [...this.violations];
    return this.violations.slice(-limit);
  }
  getCount() {
    return this.violations.length;
  }
  getTotalCount() {
    return this.totalCount;
  }
  getViolationsForCommand(command12) {
    let commandBase64 = encodeSandboxedCommand(command12);
    return this.violations.filter((v2) => v2.encodedCommand === commandBase64);
  }
  clear() {
    this.violations = [], this.notifyListeners();
  }
  subscribe(listener) {
    return this.listeners.add(listener), listener(this.getViolations()), () => {
      this.listeners.delete(listener);
    };
  }
  notifyListeners() {
    let violations = this.getViolations();
    this.listeners.forEach((listener) => listener(violations));
  }
}

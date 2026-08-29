// Original: src/utils/awsAuthStatusManager.ts
class AwsAuthStatusManager {
  static instance = null;
  status = {
    isAuthenticating: !1,
    output: []
  };
  changed = createSignal();
  static getInstance() {
    if (!AwsAuthStatusManager.instance)
      AwsAuthStatusManager.instance = new AwsAuthStatusManager;
    return AwsAuthStatusManager.instance;
  }
  getStatus() {
    return {
      ...this.status,
      output: [...this.status.output]
    };
  }
  startAuthentication() {
    this.status = {
      isAuthenticating: !0,
      output: []
    }, this.changed.emit(this.getStatus());
  }
  addOutput(line) {
    this.status.output.push(line), this.changed.emit(this.getStatus());
  }
  setError(error41) {
    this.status.error = error41, this.changed.emit(this.getStatus());
  }
  endAuthentication(success2) {
    if (success2)
      this.status = {
        isAuthenticating: !1,
        output: []
      };
    else
      this.status.isAuthenticating = !1;
    this.changed.emit(this.getStatus());
  }
  subscribe = this.changed.subscribe;
  static reset() {
    if (AwsAuthStatusManager.instance)
      AwsAuthStatusManager.instance.changed.clear(), AwsAuthStatusManager.instance = null;
  }
}
var init_awsAuthStatusManager = () => {};

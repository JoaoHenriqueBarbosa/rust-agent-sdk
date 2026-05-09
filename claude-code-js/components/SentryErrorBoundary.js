// Original: src/components/SentryErrorBoundary.ts
var React26, SentryErrorBoundary;
var init_SentryErrorBoundary = __esm(() => {
  React26 = __toESM(require_react_development(), 1);
  SentryErrorBoundary = class SentryErrorBoundary extends React26.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: !1 };
    }
    static getDerivedStateFromError() {
      return { hasError: !0 };
    }
    render() {
      if (this.state.hasError)
        return null;
      return this.props.children;
    }
  };
});

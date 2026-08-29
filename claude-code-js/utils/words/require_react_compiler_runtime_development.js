// var: require_react_compiler_runtime_development
var require_react_compiler_runtime_development = __commonJS((exports) => {
  var react = __toESM(require_react_development());
  (function() {
    var ReactSharedInternals = react.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    exports.c = function(size) {
      var dispatcher = ReactSharedInternals.H;
      return dispatcher === null && console.error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`), dispatcher.useMemoCache(size);
    };
  })();
});

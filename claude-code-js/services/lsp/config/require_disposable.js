// var: require_disposable
var require_disposable = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Disposable = void 0;
  var Disposable;
  (function(Disposable2) {
    function create(func) {
      return {
        dispose: func
      };
    }
    Disposable2.create = create;
  })(Disposable || (exports.Disposable = Disposable = {}));
});

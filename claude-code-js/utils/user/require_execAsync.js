// var: require_execAsync
var require_execAsync = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.execAsync = void 0;
  var child_process3 = __require("child_process"), util12 = __require("util");
  exports.execAsync = util12.promisify(child_process3.exec);
});

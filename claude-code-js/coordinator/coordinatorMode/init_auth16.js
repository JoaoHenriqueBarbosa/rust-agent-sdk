// var: init_auth16
var init_auth16 = __esm(() => {
  init_index_node2();
  init_types();
  init_auth15();
  init_auth15();
  init_errors10();
  UnauthorizedError = class UnauthorizedError extends Error {
    constructor(message) {
      super(message ?? "Unauthorized");
    }
  };
});

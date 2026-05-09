// var: init_beta
var init_beta = __esm(() => {
  init_files();
  init_files();
  init_models();
  init_models();
  init_messages();
  init_messages();
  Beta = class Beta extends APIResource {
    constructor() {
      super(...arguments);
      this.models = new Models(this._client), this.messages = new Messages(this._client), this.files = new Files(this._client);
    }
  };
  Beta.Models = Models;
  Beta.Messages = Messages;
  Beta.Files = Files;
});

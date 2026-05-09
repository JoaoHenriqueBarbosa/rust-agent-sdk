// var: SENSITIVE_STRING2
var SENSITIVE_STRING2 = "***SensitiveInformation***";

// node_modules/@aws-sdk/credential-provider-http/node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient = (commands, Client2, options) => {
  for (let [command2, CommandCtor] of Object.entries(commands)) {
    let methodImpl = async function(args, optionsOrCb, cb) {
      let command3 = new CommandCtor(args);
      if (typeof optionsOrCb === "function")
        this.send(command3, optionsOrCb);
      else if (typeof cb === "function") {
        if (typeof optionsOrCb !== "object")
          throw Error(`Expected http options but got ${typeof optionsOrCb}`);
        this.send(command3, optionsOrCb || {}, cb);
      } else
        return this.send(command3, optionsOrCb);
    }, methodName = (command2[0].toLowerCase() + command2.slice(1)).replace(/Command$/, "");
    Client2.prototype[methodName] = methodImpl;
  }
  let { paginators = {}, waiters = {} } = options ?? {};
  for (let [paginatorName, paginatorFn] of Object.entries(paginators))
    if (Client2.prototype[paginatorName] === void 0)
      Client2.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
        return paginatorFn({
          ...paginationConfiguration,
          client: this
        }, commandInput, ...rest);
      };
  for (let [waiterName, waiterFn] of Object.entries(waiters))
    if (Client2.prototype[waiterName] === void 0)
      Client2.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
        let config3 = waiterConfiguration;
        if (typeof waiterConfiguration === "number")
          config3 = {
            maxWaitTime: waiterConfiguration
          };
        return waiterFn({
          ...config3,
          client: this
        }, commandInput, ...rest);
      };
};

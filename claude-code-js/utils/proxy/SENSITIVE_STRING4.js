// var: SENSITIVE_STRING4
var SENSITIVE_STRING4 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-bedrock/node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient2 = (commands, Client3, options) => {
  for (let [command4, CommandCtor] of Object.entries(commands)) {
    let methodImpl = async function(args, optionsOrCb, cb) {
      let command5 = new CommandCtor(args);
      if (typeof optionsOrCb === "function")
        this.send(command5, optionsOrCb);
      else if (typeof cb === "function") {
        if (typeof optionsOrCb !== "object")
          throw Error(`Expected http options but got ${typeof optionsOrCb}`);
        this.send(command5, optionsOrCb || {}, cb);
      } else
        return this.send(command5, optionsOrCb);
    }, methodName = (command4[0].toLowerCase() + command4.slice(1)).replace(/Command$/, "");
    Client3.prototype[methodName] = methodImpl;
  }
  let { paginators = {}, waiters = {} } = options ?? {};
  for (let [paginatorName, paginatorFn] of Object.entries(paginators))
    if (Client3.prototype[paginatorName] === void 0)
      Client3.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
        return paginatorFn({
          ...paginationConfiguration,
          client: this
        }, commandInput, ...rest);
      };
  for (let [waiterName, waiterFn] of Object.entries(waiters))
    if (Client3.prototype[waiterName] === void 0)
      Client3.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
        let config4 = waiterConfiguration;
        if (typeof waiterConfiguration === "number")
          config4 = {
            maxWaitTime: waiterConfiguration
          };
        return waiterFn({
          ...config4,
          client: this
        }, commandInput, ...rest);
      };
};

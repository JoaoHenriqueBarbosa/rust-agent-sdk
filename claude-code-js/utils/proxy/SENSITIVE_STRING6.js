// var: SENSITIVE_STRING6
var SENSITIVE_STRING6 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-bedrock-runtime/node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient3 = (commands3, Client4, options) => {
  for (let [command6, CommandCtor] of Object.entries(commands3)) {
    let methodImpl = async function(args, optionsOrCb, cb) {
      let command7 = new CommandCtor(args);
      if (typeof optionsOrCb === "function")
        this.send(command7, optionsOrCb);
      else if (typeof cb === "function") {
        if (typeof optionsOrCb !== "object")
          throw Error(`Expected http options but got ${typeof optionsOrCb}`);
        this.send(command7, optionsOrCb || {}, cb);
      } else
        return this.send(command7, optionsOrCb);
    }, methodName = (command6[0].toLowerCase() + command6.slice(1)).replace(/Command$/, "");
    Client4.prototype[methodName] = methodImpl;
  }
  let { paginators: paginators2 = {}, waiters = {} } = options ?? {};
  for (let [paginatorName, paginatorFn] of Object.entries(paginators2))
    if (Client4.prototype[paginatorName] === void 0)
      Client4.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
        return paginatorFn({
          ...paginationConfiguration,
          client: this
        }, commandInput, ...rest);
      };
  for (let [waiterName, waiterFn] of Object.entries(waiters))
    if (Client4.prototype[waiterName] === void 0)
      Client4.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
        let config5 = waiterConfiguration;
        if (typeof waiterConfiguration === "number")
          config5 = {
            maxWaitTime: waiterConfiguration
          };
        return waiterFn({
          ...config5,
          client: this
        }, commandInput, ...rest);
      };
};

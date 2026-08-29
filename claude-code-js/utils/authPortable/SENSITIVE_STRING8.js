// var: SENSITIVE_STRING8
var SENSITIVE_STRING8 = "***SensitiveInformation***";

// node_modules/@aws-sdk/client-sts/node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient4 = (commands5, Client5, options) => {
  for (let [command8, CommandCtor] of Object.entries(commands5)) {
    let methodImpl = async function(args, optionsOrCb, cb) {
      let command9 = new CommandCtor(args);
      if (typeof optionsOrCb === "function")
        this.send(command9, optionsOrCb);
      else if (typeof cb === "function") {
        if (typeof optionsOrCb !== "object")
          throw Error(`Expected http options but got ${typeof optionsOrCb}`);
        this.send(command9, optionsOrCb || {}, cb);
      } else
        return this.send(command9, optionsOrCb);
    }, methodName = (command8[0].toLowerCase() + command8.slice(1)).replace(/Command$/, "");
    Client5.prototype[methodName] = methodImpl;
  }
  let { paginators: paginators3 = {}, waiters = {} } = options ?? {};
  for (let [paginatorName, paginatorFn] of Object.entries(paginators3))
    if (Client5.prototype[paginatorName] === void 0)
      Client5.prototype[paginatorName] = function(commandInput = {}, paginationConfiguration, ...rest) {
        return paginatorFn({
          ...paginationConfiguration,
          client: this
        }, commandInput, ...rest);
      };
  for (let [waiterName, waiterFn] of Object.entries(waiters))
    if (Client5.prototype[waiterName] === void 0)
      Client5.prototype[waiterName] = async function(commandInput = {}, waiterConfiguration, ...rest) {
        let config6 = waiterConfiguration;
        if (typeof waiterConfiguration === "number")
          config6 = {
            maxWaitTime: waiterConfiguration
          };
        return waiterFn({
          ...config6,
          client: this
        }, commandInput, ...rest);
      };
};

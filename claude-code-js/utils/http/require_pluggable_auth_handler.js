// var: require_pluggable_auth_handler
var require_pluggable_auth_handler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PluggableAuthHandler = void 0;
  var pluggable_auth_client_1 = require_pluggable_auth_client(), executable_response_1 = require_executable_response(), childProcess3 = __require("child_process"), fs9 = __require("fs");

  class PluggableAuthHandler {
    constructor(options) {
      if (!options.command)
        throw Error("No command provided.");
      if (this.commandComponents = PluggableAuthHandler.parseCommand(options.command), this.timeoutMillis = options.timeoutMillis, !this.timeoutMillis)
        throw Error("No timeoutMillis provided.");
      this.outputFile = options.outputFile;
    }
    retrieveResponseFromExecutable(envMap) {
      return new Promise((resolve9, reject) => {
        let child = childProcess3.spawn(this.commandComponents[0], this.commandComponents.slice(1), {
          env: { ...process.env, ...Object.fromEntries(envMap) }
        }), output = "";
        child.stdout.on("data", (data) => {
          output += data;
        }), child.stderr.on("data", (err) => {
          output += err;
        });
        let timeout = setTimeout(() => {
          return child.removeAllListeners(), child.kill(), reject(Error("The executable failed to finish within the timeout specified."));
        }, this.timeoutMillis);
        child.on("close", (code) => {
          if (clearTimeout(timeout), code === 0)
            try {
              let responseJson = JSON.parse(output), response7 = new executable_response_1.ExecutableResponse(responseJson);
              return resolve9(response7);
            } catch (error43) {
              if (error43 instanceof executable_response_1.ExecutableResponseError)
                return reject(error43);
              return reject(new executable_response_1.ExecutableResponseError(`The executable returned an invalid response: ${output}`));
            }
          else
            return reject(new pluggable_auth_client_1.ExecutableError(output, code.toString()));
        });
      });
    }
    async retrieveCachedResponse() {
      if (!this.outputFile || this.outputFile.length === 0)
        return;
      let filePath;
      try {
        filePath = await fs9.promises.realpath(this.outputFile);
      } catch (_a2) {
        return;
      }
      if (!(await fs9.promises.lstat(filePath)).isFile())
        return;
      let responseString = await fs9.promises.readFile(filePath, {
        encoding: "utf8"
      });
      if (responseString === "")
        return;
      try {
        let responseJson = JSON.parse(responseString);
        if (new executable_response_1.ExecutableResponse(responseJson).isValid())
          return new executable_response_1.ExecutableResponse(responseJson);
        return;
      } catch (error43) {
        if (error43 instanceof executable_response_1.ExecutableResponseError)
          throw error43;
        throw new executable_response_1.ExecutableResponseError(`The output file contained an invalid response: ${responseString}`);
      }
    }
    static parseCommand(command12) {
      let components = command12.match(/(?:[^\s"]+|"[^"]*")+/g);
      if (!components)
        throw Error(`Provided command: "${command12}" could not be parsed.`);
      for (let i4 = 0;i4 < components.length; i4++)
        if (components[i4][0] === '"' && components[i4].slice(-1) === '"')
          components[i4] = components[i4].slice(1, -1);
      return components;
    }
  }
  exports.PluggableAuthHandler = PluggableAuthHandler;
});

// function: createMcpConfig
function createMcpConfig(serverType, entryPoint) {
  switch (serverType) {
    case "node":
      return {
        command: "node",
        args: ["${__dirname}/" + entryPoint],
        env: {}
      };
    case "python":
      return {
        command: "python",
        args: ["${__dirname}/" + entryPoint],
        env: {
          PYTHONPATH: "${__dirname}/server/lib"
        }
      };
    case "binary":
      return {
        command: "${__dirname}/" + entryPoint,
        args: [],
        env: {}
      };
  }
}

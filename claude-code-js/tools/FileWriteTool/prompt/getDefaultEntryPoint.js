// function: getDefaultEntryPoint
function getDefaultEntryPoint(serverType, packageData) {
  switch (serverType) {
    case "node":
      return packageData?.main || "server/index.js";
    case "python":
      return "server/main.py";
    case "binary":
      return "server/my-server";
  }
}

// var: validateIpcInputOption
var validateIpcInputOption = ({ ipcInput, ipc, serialization }) => {
  if (ipcInput === void 0)
    return;
  if (!ipc)
    throw Error("The `ipcInput` option cannot be set unless the `ipc` option is `true`.");
  validateIpcInput[serialization](ipcInput);
}, validateAdvancedInput = (ipcInput) => {
  try {
    serialize(ipcInput);
  } catch (error41) {
    throw Error("The `ipcInput` option is not serializable with a structured clone.", { cause: error41 });
  }
}, validateJsonInput = (ipcInput) => {
  try {
    JSON.stringify(ipcInput);
  } catch (error41) {
    throw Error("The `ipcInput` option is not serializable with JSON.", { cause: error41 });
  }
}, validateIpcInput, sendIpcInput = async (subprocess, ipcInput) => {
  if (ipcInput === void 0)
    return;
  await subprocess.sendMessage(ipcInput);
};

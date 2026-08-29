// function: maybeNotifyIDEConnected
async function maybeNotifyIDEConnected(client15) {
  await client15.notification({
    method: "ide_connected",
    params: {
      pid: process.pid
    }
  });
}

// function: refreshInstance
async function refreshInstance(instance, data) {
  await instance.setPayload(data || instance.getPayload());
}

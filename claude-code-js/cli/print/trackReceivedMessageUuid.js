// function: trackReceivedMessageUuid
function trackReceivedMessageUuid(uuid8) {
  if (receivedMessageUuids.has(uuid8))
    return !1;
  if (receivedMessageUuids.add(uuid8), receivedMessageUuidsOrder.push(uuid8), receivedMessageUuidsOrder.length > MAX_RECEIVED_UUIDS) {
    let toEvict = receivedMessageUuidsOrder.splice(0, receivedMessageUuidsOrder.length - MAX_RECEIVED_UUIDS);
    for (let old of toEvict)
      receivedMessageUuids.delete(old);
  }
  return !0;
}

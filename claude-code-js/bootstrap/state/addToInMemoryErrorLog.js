// function: addToInMemoryErrorLog
function addToInMemoryErrorLog(errorInfo) {
  if (STATE.inMemoryErrorLog.length >= 100)
    STATE.inMemoryErrorLog.shift();
  STATE.inMemoryErrorLog.push(errorInfo);
}

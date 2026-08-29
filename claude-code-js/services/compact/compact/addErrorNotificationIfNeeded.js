// function: addErrorNotificationIfNeeded
function addErrorNotificationIfNeeded(error44, context6) {
  if (!hasExactErrorMessage(error44, ERROR_MESSAGE_USER_ABORT) && !hasExactErrorMessage(error44, ERROR_MESSAGE_NOT_ENOUGH_MESSAGES))
    context6.addNotification?.({
      key: "error-compacting-conversation",
      text: "Error compacting conversation",
      priority: "immediate",
      color: "error"
    });
}

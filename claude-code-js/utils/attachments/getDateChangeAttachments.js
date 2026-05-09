// function: getDateChangeAttachments
function getDateChangeAttachments(messages) {
  let currentDate = getLocalISODate(), lastDate = getLastEmittedDate();
  if (lastDate === null)
    return setLastEmittedDate(currentDate), [];
  if (currentDate === lastDate)
    return [];
  return setLastEmittedDate(currentDate), [{ type: "date_change", newDate: currentDate }];
}

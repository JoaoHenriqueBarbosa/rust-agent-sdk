// function: formDataToFormDataMap
function formDataToFormDataMap(formData) {
  let formDataMap = {};
  for (let [key, value] of formData.entries())
    formDataMap[key] ??= [], formDataMap[key].push(value);
  return formDataMap;
}

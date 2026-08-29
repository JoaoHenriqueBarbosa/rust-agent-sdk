// function: wwwFormUrlEncode
function wwwFormUrlEncode(formData) {
  let urlSearchParams = new URLSearchParams;
  for (let [key, value] of Object.entries(formData))
    if (Array.isArray(value))
      for (let subValue of value)
        urlSearchParams.append(key, subValue.toString());
    else
      urlSearchParams.append(key, value.toString());
  return urlSearchParams.toString();
}

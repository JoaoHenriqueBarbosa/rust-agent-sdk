// var: hasHeader
var hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (let headerName of Object.keys(headers))
    if (soughtHeader === headerName.toLowerCase())
      return !0;
  return !1;
};

// function: addLibraryInfo
function addLibraryInfo(parameters, libraryInfo) {
  if (parameters.set(X_CLIENT_SKU, libraryInfo.sku), parameters.set(X_CLIENT_VER, libraryInfo.version), libraryInfo.os)
    parameters.set(X_CLIENT_OS, libraryInfo.os);
  if (libraryInfo.cpu)
    parameters.set(X_CLIENT_CPU, libraryInfo.cpu);
}

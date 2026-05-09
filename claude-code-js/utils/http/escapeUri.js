// var: escapeUri
var escapeUri = (uri7) => encodeURIComponent(uri7).replace(/[!'()*]/g, hexEncode), hexEncode = (c3) => `%${c3.charCodeAt(0).toString(16).toUpperCase()}`;

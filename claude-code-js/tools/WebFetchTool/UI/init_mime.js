// var: init_mime
var init_mime = __esm(() => {
  voidElements2 = { test: () => !0 }, Mime = {
    "text/html": {
      docType: "<!DOCTYPE html>",
      ignoreCase: !0,
      voidElements: /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
    },
    "image/svg+xml": {
      docType: '<?xml version="1.0" encoding="utf-8"?>',
      ignoreCase: !1,
      voidElements: voidElements2
    },
    "text/xml": {
      docType: '<?xml version="1.0" encoding="utf-8"?>',
      ignoreCase: !1,
      voidElements: voidElements2
    },
    "application/xml": {
      docType: '<?xml version="1.0" encoding="utf-8"?>',
      ignoreCase: !1,
      voidElements: voidElements2
    },
    "application/xhtml+xml": {
      docType: '<?xml version="1.0" encoding="utf-8"?>',
      ignoreCase: !1,
      voidElements: voidElements2
    }
  };
});

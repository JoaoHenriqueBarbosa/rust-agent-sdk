// function: render3
function render3(renderFunc, text2, params) {
  if (!params.cb)
    return new Promise(function(resolve44, reject2) {
      try {
        let data = QRCode.create(text2, params.opts);
        return renderFunc(data, params.opts, function(err2, data2) {
          return err2 ? reject2(err2) : resolve44(data2);
        });
      } catch (e) {
        reject2(e);
      }
    });
  try {
    let data = QRCode.create(text2, params.opts);
    return renderFunc(data, params.opts, params.cb);
  } catch (e) {
    params.cb(e);
  }
}

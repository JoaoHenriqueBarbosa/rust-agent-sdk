// var: require_interlace
var require_interlace = __commonJS((exports) => {
  var imagePasses = [
    {
      x: [0],
      y: [0]
    },
    {
      x: [4],
      y: [0]
    },
    {
      x: [0, 4],
      y: [4]
    },
    {
      x: [2, 6],
      y: [0, 4]
    },
    {
      x: [0, 2, 4, 6],
      y: [2, 6]
    },
    {
      x: [1, 3, 5, 7],
      y: [0, 2, 4, 6]
    },
    {
      x: [0, 1, 2, 3, 4, 5, 6, 7],
      y: [1, 3, 5, 7]
    }
  ];
  exports.getImagePasses = function(width, height2) {
    let images = [], xLeftOver = width % 8, yLeftOver = height2 % 8, xRepeats = (width - xLeftOver) / 8, yRepeats = (height2 - yLeftOver) / 8;
    for (let i5 = 0;i5 < imagePasses.length; i5++) {
      let pass6 = imagePasses[i5], passWidth = xRepeats * pass6.x.length, passHeight = yRepeats * pass6.y.length;
      for (let j4 = 0;j4 < pass6.x.length; j4++)
        if (pass6.x[j4] < xLeftOver)
          passWidth++;
        else
          break;
      for (let j4 = 0;j4 < pass6.y.length; j4++)
        if (pass6.y[j4] < yLeftOver)
          passHeight++;
        else
          break;
      if (passWidth > 0 && passHeight > 0)
        images.push({ width: passWidth, height: passHeight, index: i5 });
    }
    return images;
  };
  exports.getInterlaceIterator = function(width) {
    return function(x4, y2, pass6) {
      let outerXLeftOver = x4 % imagePasses[pass6].x.length, outerX = (x4 - outerXLeftOver) / imagePasses[pass6].x.length * 8 + imagePasses[pass6].x[outerXLeftOver], outerYLeftOver = y2 % imagePasses[pass6].y.length, outerY = (y2 - outerYLeftOver) / imagePasses[pass6].y.length * 8 + imagePasses[pass6].y[outerYLeftOver];
      return outerX * 4 + outerY * width * 4;
    };
  };
});

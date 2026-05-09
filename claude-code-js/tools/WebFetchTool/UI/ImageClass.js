// class: ImageClass
var ImageClass = (ownerDocument) => class extends HTMLImageElement {
  constructor(width, height2) {
    super(ownerDocument);
    switch (arguments.length) {
      case 1:
        this.height = width, this.width = width;
        break;
      case 2:
        this.height = height2, this.width = width;
        break;
    }
  }
};

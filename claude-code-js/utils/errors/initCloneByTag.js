// function: initCloneByTag
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag3:
      return _cloneArrayBuffer_default(object);
    case boolTag3:
    case dateTag3:
      return new Ctor(+object);
    case dataViewTag4:
      return _cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return _cloneTypedArray_default(object, isDeep);
    case mapTag4:
      return new Ctor;
    case numberTag3:
    case stringTag3:
      return new Ctor(object);
    case regexpTag3:
      return _cloneRegExp_default(object);
    case setTag4:
      return new Ctor;
    case symbolTag3:
      return _cloneSymbol_default(object);
  }
}

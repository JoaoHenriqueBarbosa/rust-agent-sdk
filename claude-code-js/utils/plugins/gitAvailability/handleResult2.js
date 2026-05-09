// var: handleResult2
var handleResult2 = (ctx, result) => {
  if (isValid(result))
    return { success: !0, data: result.value };
  else {
    if (!ctx.common.issues.length)
      throw Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error)
          return this._error;
        let error44 = new ZodError2(ctx.common.issues);
        return this._error = error44, this._error;
      }
    };
  }
}, cuidRegex, cuid2Regex, ulidRegex, uuidRegex2, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", dateRegex, ZodString2, ZodNumber2, ZodBigInt2, ZodBoolean2, ZodDate2, ZodSymbol2, ZodUndefined2, ZodNull2, ZodAny2, ZodUnknown2, ZodNever2, ZodVoid2, ZodArray2, ZodObject2, ZodUnion2, getDiscriminator = (type) => {
  if (type instanceof ZodLazy2)
    return getDiscriminator(type.schema);
  else if (type instanceof ZodEffects)
    return getDiscriminator(type.innerType());
  else if (type instanceof ZodLiteral2)
    return [type.value];
  else if (type instanceof ZodEnum2)
    return type.options;
  else if (type instanceof ZodNativeEnum)
    return util10.objectValues(type.enum);
  else if (type instanceof ZodDefault2)
    return getDiscriminator(type._def.innerType);
  else if (type instanceof ZodUndefined2)
    return [void 0];
  else if (type instanceof ZodNull2)
    return [null];
  else if (type instanceof ZodOptional2)
    return [void 0, ...getDiscriminator(type.unwrap())];
  else if (type instanceof ZodNullable2)
    return [null, ...getDiscriminator(type.unwrap())];
  else if (type instanceof ZodBranded)
    return getDiscriminator(type.unwrap());
  else if (type instanceof ZodReadonly2)
    return getDiscriminator(type.unwrap());
  else if (type instanceof ZodCatch2)
    return getDiscriminator(type._def.innerType);
  else
    return [];
}, ZodDiscriminatedUnion2, ZodIntersection2, ZodTuple2, ZodRecord2, ZodMap2, ZodSet2, ZodFunction, ZodLazy2, ZodLiteral2, ZodEnum2, ZodNativeEnum, ZodPromise2, ZodEffects, ZodOptional2, ZodNullable2, ZodDefault2, ZodCatch2, ZodNaN2, BRAND, ZodBranded, ZodPipeline, ZodReadonly2, late, ZodFirstPartyTypeKind, instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom3((data) => data instanceof cls, params), stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring = () => stringType().optional(), onumber = () => numberType().optional(), oboolean = () => booleanType().optional(), coerce2, NEVER2;

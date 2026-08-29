// function: processCreateParams
function processCreateParams(params) {
  if (!params)
    return {};
  let { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error))
    throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  if (errorMap2)
    return { errorMap: errorMap2, description };
  return { errorMap: (iss, ctx) => {
    let { message } = params;
    if (iss.code === "invalid_enum_value")
      return { message: message ?? ctx.defaultError };
    if (typeof ctx.data > "u")
      return { message: message ?? required_error ?? ctx.defaultError };
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  }, description };
}

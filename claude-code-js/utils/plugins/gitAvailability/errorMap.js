// var: errorMap
var errorMap = (issue2, _ctx) => {
  let message;
  switch (issue2.code) {
    case ZodIssueCode2.invalid_type:
      if (issue2.received === ZodParsedType.undefined)
        message = "Required";
      else
        message = `Expected ${issue2.expected}, received ${issue2.received}`;
      break;
    case ZodIssueCode2.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue2.expected, util10.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode2.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util10.joinValues(issue2.keys, ", ")}`;
      break;
    case ZodIssueCode2.invalid_union:
      message = "Invalid input";
      break;
    case ZodIssueCode2.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util10.joinValues(issue2.options)}`;
      break;
    case ZodIssueCode2.invalid_enum_value:
      message = `Invalid enum value. Expected ${util10.joinValues(issue2.options)}, received '${issue2.received}'`;
      break;
    case ZodIssueCode2.invalid_arguments:
      message = "Invalid function arguments";
      break;
    case ZodIssueCode2.invalid_return_type:
      message = "Invalid function return type";
      break;
    case ZodIssueCode2.invalid_date:
      message = "Invalid date";
      break;
    case ZodIssueCode2.invalid_string:
      if (typeof issue2.validation === "object")
        if ("includes" in issue2.validation) {
          if (message = `Invalid input: must include "${issue2.validation.includes}"`, typeof issue2.validation.position === "number")
            message = `${message} at one or more positions greater than or equal to ${issue2.validation.position}`;
        } else if ("startsWith" in issue2.validation)
          message = `Invalid input: must start with "${issue2.validation.startsWith}"`;
        else if ("endsWith" in issue2.validation)
          message = `Invalid input: must end with "${issue2.validation.endsWith}"`;
        else
          util10.assertNever(issue2.validation);
      else if (issue2.validation !== "regex")
        message = `Invalid ${issue2.validation}`;
      else
        message = "Invalid";
      break;
    case ZodIssueCode2.too_small:
      if (issue2.type === "array")
        message = `Array must contain ${issue2.exact ? "exactly" : issue2.inclusive ? "at least" : "more than"} ${issue2.minimum} element(s)`;
      else if (issue2.type === "string")
        message = `String must contain ${issue2.exact ? "exactly" : issue2.inclusive ? "at least" : "over"} ${issue2.minimum} character(s)`;
      else if (issue2.type === "number")
        message = `Number must be ${issue2.exact ? "exactly equal to " : issue2.inclusive ? "greater than or equal to " : "greater than "}${issue2.minimum}`;
      else if (issue2.type === "bigint")
        message = `Number must be ${issue2.exact ? "exactly equal to " : issue2.inclusive ? "greater than or equal to " : "greater than "}${issue2.minimum}`;
      else if (issue2.type === "date")
        message = `Date must be ${issue2.exact ? "exactly equal to " : issue2.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(issue2.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode2.too_big:
      if (issue2.type === "array")
        message = `Array must contain ${issue2.exact ? "exactly" : issue2.inclusive ? "at most" : "less than"} ${issue2.maximum} element(s)`;
      else if (issue2.type === "string")
        message = `String must contain ${issue2.exact ? "exactly" : issue2.inclusive ? "at most" : "under"} ${issue2.maximum} character(s)`;
      else if (issue2.type === "number")
        message = `Number must be ${issue2.exact ? "exactly" : issue2.inclusive ? "less than or equal to" : "less than"} ${issue2.maximum}`;
      else if (issue2.type === "bigint")
        message = `BigInt must be ${issue2.exact ? "exactly" : issue2.inclusive ? "less than or equal to" : "less than"} ${issue2.maximum}`;
      else if (issue2.type === "date")
        message = `Date must be ${issue2.exact ? "exactly" : issue2.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(issue2.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode2.custom:
      message = "Invalid input";
      break;
    case ZodIssueCode2.invalid_intersection_types:
      message = "Intersection results could not be merged";
      break;
    case ZodIssueCode2.not_multiple_of:
      message = `Number must be a multiple of ${issue2.multipleOf}`;
      break;
    case ZodIssueCode2.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError, util10.assertNever(issue2);
  }
  return { message };
}, en_default2;

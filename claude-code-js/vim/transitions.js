// Original: src/vim/transitions.ts
function transition(state4, input, ctx) {
  switch (state4.type) {
    case "idle":
      return fromIdle(input, ctx);
    case "count":
      return fromCount(state4, input, ctx);
    case "operator":
      return fromOperator(state4, input, ctx);
    case "operatorCount":
      return fromOperatorCount(state4, input, ctx);
    case "operatorFind":
      return fromOperatorFind(state4, input, ctx);
    case "operatorTextObj":
      return fromOperatorTextObj(state4, input, ctx);
    case "find":
      return fromFind(state4, input, ctx);
    case "g":
      return fromG(state4, input, ctx);
    case "operatorG":
      return fromOperatorG(state4, input, ctx);
    case "replace":
      return fromReplace(state4, input, ctx);
    case "indent":
      return fromIndent(state4, input, ctx);
  }
}
function handleNormalInput(input, count4, ctx) {
  if (isOperatorKey(input))
    return { next: { type: "operator", op: OPERATORS[input], count: count4 } };
  if (SIMPLE_MOTIONS.has(input))
    return {
      execute: () => {
        let target = resolveMotion(input, ctx.cursor, count4);
        ctx.setOffset(target.offset);
      }
    };
  if (FIND_KEYS.has(input))
    return { next: { type: "find", find: input, count: count4 } };
  if (input === "g")
    return { next: { type: "g", count: count4 } };
  if (input === "r")
    return { next: { type: "replace", count: count4 } };
  if (input === ">" || input === "<")
    return { next: { type: "indent", dir: input, count: count4 } };
  if (input === "~")
    return { execute: () => executeToggleCase(count4, ctx) };
  if (input === "x")
    return { execute: () => executeX(count4, ctx) };
  if (input === "J")
    return { execute: () => executeJoin(count4, ctx) };
  if (input === "p" || input === "P")
    return { execute: () => executePaste(input === "p", count4, ctx) };
  if (input === "D")
    return { execute: () => executeOperatorMotion("delete", "$", 1, ctx) };
  if (input === "C")
    return { execute: () => executeOperatorMotion("change", "$", 1, ctx) };
  if (input === "Y")
    return { execute: () => executeLineOp("yank", count4, ctx) };
  if (input === "G")
    return {
      execute: () => {
        if (count4 === 1)
          ctx.setOffset(ctx.cursor.startOfLastLine().offset);
        else
          ctx.setOffset(ctx.cursor.goToLine(count4).offset);
      }
    };
  if (input === ".")
    return { execute: () => ctx.onDotRepeat?.() };
  if (input === ";" || input === ",")
    return { execute: () => executeRepeatFind(input === ",", count4, ctx) };
  if (input === "u")
    return { execute: () => ctx.onUndo?.() };
  if (input === "i")
    return { execute: () => ctx.enterInsert(ctx.cursor.offset) };
  if (input === "I")
    return {
      execute: () => ctx.enterInsert(ctx.cursor.firstNonBlankInLogicalLine().offset)
    };
  if (input === "a")
    return {
      execute: () => {
        let newOffset = ctx.cursor.isAtEnd() ? ctx.cursor.offset : ctx.cursor.right().offset;
        ctx.enterInsert(newOffset);
      }
    };
  if (input === "A")
    return {
      execute: () => ctx.enterInsert(ctx.cursor.endOfLogicalLine().offset)
    };
  if (input === "o")
    return { execute: () => executeOpenLine("below", ctx) };
  if (input === "O")
    return { execute: () => executeOpenLine("above", ctx) };
  return null;
}
function handleOperatorInput(op, count4, input, ctx) {
  if (isTextObjScopeKey(input))
    return {
      next: {
        type: "operatorTextObj",
        op,
        count: count4,
        scope: TEXT_OBJ_SCOPES[input]
      }
    };
  if (FIND_KEYS.has(input))
    return {
      next: { type: "operatorFind", op, count: count4, find: input }
    };
  if (SIMPLE_MOTIONS.has(input))
    return { execute: () => executeOperatorMotion(op, input, count4, ctx) };
  if (input === "G")
    return { execute: () => executeOperatorG(op, count4, ctx) };
  if (input === "g")
    return { next: { type: "operatorG", op, count: count4 } };
  return null;
}
function fromIdle(input, ctx) {
  if (/[1-9]/.test(input))
    return { next: { type: "count", digits: input } };
  if (input === "0")
    return {
      execute: () => ctx.setOffset(ctx.cursor.startOfLogicalLine().offset)
    };
  let result = handleNormalInput(input, 1, ctx);
  if (result)
    return result;
  return {};
}
function fromCount(state4, input, ctx) {
  if (/[0-9]/.test(input)) {
    let newDigits = state4.digits + input, count5 = Math.min(parseInt(newDigits, 10), MAX_VIM_COUNT);
    return { next: { type: "count", digits: String(count5) } };
  }
  let count4 = parseInt(state4.digits, 10), result = handleNormalInput(input, count4, ctx);
  if (result)
    return result;
  return { next: { type: "idle" } };
}
function fromOperator(state4, input, ctx) {
  if (input === state4.op[0])
    return { execute: () => executeLineOp(state4.op, state4.count, ctx) };
  if (/[0-9]/.test(input))
    return {
      next: {
        type: "operatorCount",
        op: state4.op,
        count: state4.count,
        digits: input
      }
    };
  let result = handleOperatorInput(state4.op, state4.count, input, ctx);
  if (result)
    return result;
  return { next: { type: "idle" } };
}
function fromOperatorCount(state4, input, ctx) {
  if (/[0-9]/.test(input)) {
    let newDigits = state4.digits + input, parsedDigits = Math.min(parseInt(newDigits, 10), MAX_VIM_COUNT);
    return { next: { ...state4, digits: String(parsedDigits) } };
  }
  let motionCount = parseInt(state4.digits, 10), effectiveCount = state4.count * motionCount, result = handleOperatorInput(state4.op, effectiveCount, input, ctx);
  if (result)
    return result;
  return { next: { type: "idle" } };
}
function fromOperatorFind(state4, input, ctx) {
  return {
    execute: () => executeOperatorFind(state4.op, state4.find, input, state4.count, ctx)
  };
}
function fromOperatorTextObj(state4, input, ctx) {
  if (TEXT_OBJ_TYPES.has(input))
    return {
      execute: () => executeOperatorTextObj(state4.op, state4.scope, input, state4.count, ctx)
    };
  return { next: { type: "idle" } };
}
function fromFind(state4, input, ctx) {
  return {
    execute: () => {
      let result = ctx.cursor.findCharacter(input, state4.find, state4.count);
      if (result !== null)
        ctx.setOffset(result), ctx.setLastFind(state4.find, input);
    }
  };
}
function fromG(state4, input, ctx) {
  if (input === "j" || input === "k")
    return {
      execute: () => {
        let target = resolveMotion(`g${input}`, ctx.cursor, state4.count);
        ctx.setOffset(target.offset);
      }
    };
  if (input === "g") {
    if (state4.count > 1)
      return {
        execute: () => {
          let lines2 = ctx.text.split(`
`), targetLine = Math.min(state4.count - 1, lines2.length - 1), offset = 0;
          for (let i5 = 0;i5 < targetLine; i5++)
            offset += (lines2[i5]?.length ?? 0) + 1;
          ctx.setOffset(offset);
        }
      };
    return {
      execute: () => ctx.setOffset(ctx.cursor.startOfFirstLine().offset)
    };
  }
  return { next: { type: "idle" } };
}
function fromOperatorG(state4, input, ctx) {
  if (input === "j" || input === "k")
    return {
      execute: () => executeOperatorMotion(state4.op, `g${input}`, state4.count, ctx)
    };
  if (input === "g")
    return { execute: () => executeOperatorGg(state4.op, state4.count, ctx) };
  return { next: { type: "idle" } };
}
function fromReplace(state4, input, ctx) {
  if (input === "")
    return { next: { type: "idle" } };
  return { execute: () => executeReplace(input, state4.count, ctx) };
}
function fromIndent(state4, input, ctx) {
  if (input === state4.dir)
    return { execute: () => executeIndent(state4.dir, state4.count, ctx) };
  return { next: { type: "idle" } };
}
function executeRepeatFind(reverse, count4, ctx) {
  let lastFind = ctx.getLastFind();
  if (!lastFind)
    return;
  let findType = lastFind.type;
  if (reverse)
    findType = {
      f: "F",
      F: "f",
      t: "T",
      T: "t"
    }[findType];
  let result = ctx.cursor.findCharacter(lastFind.char, findType, count4);
  if (result !== null)
    ctx.setOffset(result);
}
var init_transitions = __esm(() => {
  init_operators();
  init_types24();
});

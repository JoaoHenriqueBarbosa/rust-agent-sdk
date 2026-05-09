// function: sortByProcedure
function sortByProcedure(arr) {
  let procs = arr.map(getProcedure);
  for (let i5 = 1;i5 < arr.length; i5++) {
    let procNew = procs[i5];
    if (procNew < 0)
      continue;
    for (let j4 = i5 - 1;j4 >= 0 && procNew < procs[j4]; j4--) {
      let token = arr[j4 + 1];
      arr[j4 + 1] = arr[j4], arr[j4] = token, procs[j4 + 1] = procs[j4], procs[j4] = procNew;
    }
  }
}

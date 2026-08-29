// function: uniqBy
function uniqBy(array2, iteratee) {
  return array2 && array2.length ? _baseUniq_default(array2, _baseIteratee_default(iteratee, 2)) : [];
}

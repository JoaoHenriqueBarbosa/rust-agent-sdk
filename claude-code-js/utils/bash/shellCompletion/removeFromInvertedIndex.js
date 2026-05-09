// function: removeFromInvertedIndex
function removeFromInvertedIndex(index2, docIdx) {
  for (let [term, postings] of index2.terms) {
    let filtered = postings.filter((p4) => p4.docIdx !== docIdx), removed = postings.length - filtered.length;
    if (removed > 0)
      if (index2.fieldCount -= removed, index2.df.set(term, (index2.df.get(term) || 0) - removed), filtered.length === 0)
        index2.terms.delete(term), index2.df.delete(term);
      else
        index2.terms.set(term, filtered);
  }
}

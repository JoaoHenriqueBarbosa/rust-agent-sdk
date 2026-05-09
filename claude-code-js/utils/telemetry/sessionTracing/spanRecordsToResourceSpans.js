// function: spanRecordsToResourceSpans
function spanRecordsToResourceSpans(readableSpans, encoder) {
  let resourceMap = createResourceMap2(readableSpans), out = [], entryIterator = resourceMap.entries(), entry = entryIterator.next();
  while (!entry.done) {
    let [resource, ilmMap] = entry.value, scopeResourceSpans = [], ilmIterator = ilmMap.values(), ilmEntry = ilmIterator.next();
    while (!ilmEntry.done) {
      let scopeSpans = ilmEntry.value;
      if (scopeSpans.length > 0) {
        let spans = scopeSpans.map((readableSpan) => sdkSpanToOtlpSpan(readableSpan, encoder));
        scopeResourceSpans.push({
          scope: createInstrumentationScope(scopeSpans[0].instrumentationScope),
          spans,
          schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl
        });
      }
      ilmEntry = ilmIterator.next();
    }
    let processedResource = createResource(resource, encoder), transformedSpans = {
      resource: processedResource,
      scopeSpans: scopeResourceSpans,
      schemaUrl: processedResource.schemaUrl
    };
    out.push(transformedSpans), entry = entryIterator.next();
  }
  return out;
}

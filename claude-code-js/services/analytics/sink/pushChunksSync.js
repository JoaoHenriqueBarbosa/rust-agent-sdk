// var: pushChunksSync
var pushChunksSync = (getChunksSync, getChunksArguments, transformStream, done) => {
  try {
    for (let chunk of getChunksSync(...getChunksArguments))
      transformStream.push(chunk);
    done();
  } catch (error41) {
    done(error41);
  }
}, runTransformSync = (generators, chunks) => [

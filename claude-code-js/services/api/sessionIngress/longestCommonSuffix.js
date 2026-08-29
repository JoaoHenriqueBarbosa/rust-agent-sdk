// function: longestCommonSuffix
function longestCommonSuffix(str1, str2) {
  var i5;
  if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1])
    return "";
  for (i5 = 0;i5 < str1.length && i5 < str2.length; i5++)
    if (str1[str1.length - (i5 + 1)] != str2[str2.length - (i5 + 1)])
      return str1.slice(-i5);
  return str1.slice(-i5);
}

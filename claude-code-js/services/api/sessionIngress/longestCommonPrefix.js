// function: longestCommonPrefix
function longestCommonPrefix(str1, str2) {
  var i5;
  for (i5 = 0;i5 < str1.length && i5 < str2.length; i5++)
    if (str1[i5] != str2[i5])
      return str1.slice(0, i5);
  return str1.slice(0, i5);
}

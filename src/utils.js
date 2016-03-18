function valuesInObject(o) {
  let arr = [];
  for ( var key in o ) {
    arr.push(o[key]);
  }
  return arr;
};

function ljust(fillChar, length, str) {
  return fillChar.repeat( length - str.length ) + str;  
}


function splitNChars(txt, num) {
  var result = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
}

var Utils = {
  valuesInObject,
  ljust,
  splitNChars
};

module.exports = Utils;
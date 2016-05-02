function valuesInObject(o) {
  let arr = [];
  for ( var key in o ) {
    arr.push(o[key]);
  }
  return arr;
};

function splitNChars(txt, num) {
  var result = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
}

var Utils = {
  valuesInObject,
  splitNChars
};

module.exports = Utils;
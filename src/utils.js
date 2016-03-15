function valuesInObject(o) {
  let arr = [];
  for ( var key in o ) {
    arr.push(o[key]);
  }
  return arr;
};

var Utils = {
  valuesInObject
};

module.exports = Utils;
import Utils from './utils'

function encodeCharsArr(arr, encodeKeys){
  return arr.map( t => encodeKeys[t]  );
}

expect(
  encodeCharsArr(["t", "a", "c", "t", "o"], { a: '01', c: '10', o: '11', t: '00' })
).toEqual(["00", "01", "10", "00", "11"]);


function encodeCharStr(str, encodeKeys){
  return str.split("").map( t => encodeKeys[t] ).join("");
}

expect(
  encodeCharStr("tacto", { a: ' \t', c: '\t ', o: '\t\t', t: '  ' })
).toEqual("   \t\t   \t\t");

function charsAsNumToAlphabet(numRepresentation, alphabet) {
  return numRepresentation.split("").map( t => alphabet[t] ).join("");
}

expect(
  charsAsNumToAlphabet("110", [" ","\t"])
).toEqual("\t\t ");

function makeDecodeKeys(keysArr, charsArr) {  
  let key = {};
  for ( var i = 0; i < keysArr.length; i++ ) {
    key[charsArr[i]] = keysArr[i];
  }
  return key;
}

expect(
  makeDecodeKeys(["00", "01", "10", "00", "11"], ["t", "a", "c", "t", "o"])
).toEqual({ a: '01', c: '10', o: '11', t: '00' });

function makeEncodeKeys(message, alphabet, keySize) {
  let messageArr = message.split("");
  let keys = {};
  let count = 0;

  messageArr.forEach(function(t){
    //example: num = 101
    var numRepresentation = count.toString(alphabet.length);
    if (keys[t] === undefined) {
      keys[t] = Utils.ljust(alphabet[0], keySize, charsAsNumToAlphabet(numRepresentation, alphabet));
      count++;
    }
  })
  return keys;
}

expect(
  makeEncodeKeys("tacto",["0","1"],2)
).toEqual({t:"00", a:"01", c:"10", o:"11"});

expect(
  makeEncodeKeys("asdfg",[" ","\t"],3)
).toEqual({a:"   ", s:"  \t", d:" \t ", f:" \t\t", g:"\t  "});

function getKeySize(message, alphabet = [" ", "\t"]) {
  let messageArr = message.split("");
  let unique = getUniqueCharacters(messageArr);
  let keySize = (unique.length - 1).toString(alphabet.length).length;
  return keySize;
}

expect(
  getKeySize("taco")
).toEqual(2);

expect(
  getKeySize("tacos")
).toEqual(3);

function getUniqueCharacters(message) {
  return [...new Set(message)];
}

expect(
  getUniqueCharacters(["a","s","d","f"," "," "," ","f"])
).toEqual(["a","s","d","f"," "]);


var Encoder = {
  encodeCharsArr,
  encodeCharStr,
  makeDecodeKeys,
  makeEncodeKeys,
  getKeySize
};

module.exports = Encoder;
console.log("tests passed!");
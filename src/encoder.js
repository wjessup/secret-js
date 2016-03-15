function decodeCharsArr(encodedArr, decodeKeys) {
  var arr = [];
  encodedArr.forEach( char => {
    console.log(char)
    arr.push(decodeKeys[whiteSpaceToBinary(char)]);
  });
  console.log(arr)
  return arr;
}

function makeDecodeKeys(keysWhiteSpace, charsWhiteSpace, keySize) {
  let keysArr = keysArrFromWhiteSpace(keysWhiteSpace);
  let charsArr = charsArrFromWhiteSpace(charsWhiteSpace, keySize);
  
  let key = {};
  for ( var i = 0; i < keysArr.length; i++ ) {
    key[charsArr[i]] = keysArr[i];
  }
  return key;
}

function encodeCharsArr(encodeKeys, message){
  let messageArr = message.split("");
  let encodedCharArr = messageArr.map( t => encodeKeys[t] );
  return encodedCharArr;
}

expect(
  encodeCharsArr({ a: '01', c: '10', o: '11', t: '00' }, "tacto")
).toEqual(["00", "01", "10", "00", "11"]);

expect(
  encodeCharsArr({ a: ' \t', c: '\t ', o: '\t\t', t: '  ' }, "tacto")
).toEqual(["  ", " \t", "\t ", "  ", "\t\t"]);

function makeEncodeKeys(message, alphabet, keySize) {
  let messageArr = message.split("");
  let keys = {};
  let count = 0;

  messageArr.forEach(function(t){
    //example: num = 101
    var numRepresentation = count.toString(alphabet.length);

    //example: {"a": "00101"} if keysize is 5
    if (keys[t] === undefined) {
      keys[t] = encodeCharacter(numRepresentation, keySize, alphabet);
      count++;
    }
  })

  return keys;
}

expect(
  makeEncodeKeys("tacto",["0","1"],2)
).toEqual({t:"00", a:"01", c:"10", t:"00", o:"11"});

expect(
  makeEncodeKeys("asdfg",[" ","\t"],3)
).toEqual({a:"   ", s:"  \t", d:" \t ", f:" \t\t", g:"\t  "});

function encodeCharacter(numRepresentation, keySize, alphabet) {
  var encodedPart = numRepresentation.split("").map( t => {
    return alphabet[t];
  });
  
  let str = alphabet[0].repeat( keySize - encodedPart.length ) + encodedPart.join("");
  return str;
}

expect(
  encodeCharacter("110", 8, [" ","\t"])
).toEqual("     \t\t ");


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


function whiteSpaceToBinary(str) {
  return str.split("").map( t => (t == " " ? "0" : "1") ).join("");
}

expect(
  whiteSpaceToBinary(" \t \t")
).toEqual("0101");

function binaryToWhiteSpace(str) {
  return str.split("").map( t => (t == "0" ? " " : "\t") ).join("");
}

expect(
  binaryToWhiteSpace("01100011")
).toEqual(" \t\t   \t\t");

function strTo8bitBinary(char) {
  let a = char.charCodeAt(0).toString(2);
  let binary = new Array(9 - a.length).join('0') + a
  return binary;
}

expect(
  strTo8bitBinary("t")
).toEqual("01110100"); 

expect(
  strTo8bitBinary("c")
).toEqual("01100011");

function charsArrFromWhiteSpace(whiteSpace, keySize) {
  let a = splitNChars(whiteSpace, keySize);
  let b = a.map( t => whiteSpaceToBinary(t) );
  return b;
}

expect(
  charsArrFromWhiteSpace(" \t\t   \t\t \t\t\t \t  ", 4)
).toEqual(["0110", "0011", "0111", "0100"]);

function keysArrFromWhiteSpace(whiteSpace){
  let keysBinArr = splitNChars(whiteSpace, 8);  
  let keysArr = keysBinArr.map( t => binaryToChar(whiteSpaceToBinary(t)) );
  return keysArr;
}

expect(
  keysArrFromWhiteSpace(" \t\t   \t\t \t\t\t \t  ")
).toEqual(["c","t"]);

function keysToWhiteSpace(encodeKeys) {
  let keys = Object.keys(encodeKeys);
  
  let keysWhiteSpace = keys.map( t => binaryToWhiteSpace(strTo8bitBinary(t)) ).join("");
  return keysWhiteSpace;
}

expect(
  keysToWhiteSpace({c:"", t:""})
).toEqual(" \t\t   \t\t \t\t\t \t  ");

function binaryToChar(str) {
  return String.fromCharCode(parseInt(str, 2));
}

expect(
  binaryToChar("01100011")
).toEqual("c");

function splitNChars(txt, num) {
  var result = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
}



var Encoder = {
  decodeCharsArr,
  encodeCharsArr,
  makeDecodeKeys,
  makeEncodeKeys,
  keysToWhiteSpace,
  getKeySize
};

module.exports = Encoder;
console.log("tests passed!");
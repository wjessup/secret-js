import CryptoJS from 'crypto-js';
import Utils from './utils'
import Encoder from 'encoder-js'

const CHARACTERS_PER_LINE = 4;
const AES_KEY = "secretKey";
const BINARY_TO_WHITE_SPACE_KEY = { 0: " ", 1: "\t" };
const WHITE_SPACE_TO_BINARY_KEY = { " ": 0, "\t": 1 };

let fileText = `
my
example
sd
file
with
a
few
lines
but
it
needs
more
lines
really
a
lot
of
lines
`

/*
Encrypts and hides a message in the whitespace along with the encodeKeys in 
the bottom 3 lines of the file. 
*/
export function hideMessage(message, fileText, alphabet = [" ","\t"]){
  
  //ENCRYPT
  var encrypted = '' + CryptoJS.AES.encrypt(message, AES_KEY);
  console.log(encrypted)
  
  //ENCODE CHARS
  let [encodeKeys, keySize, encodedCharArr] = Encoder.encode(encrypted, alphabet);

  //INSERT ENCODED CHARS
  let newLines = addCharsToFileText(fileText, encodedCharArr);

  //INSERT ENCODE KEYS
  let keysWhiteSpaceStr = Object.keys(encodeKeys).map( t => Encoder.encodeCharStr( charTo8bitBinary(t), BINARY_TO_WHITE_SPACE_KEY) ).join("")  
  let charsWhiteSpaceStr = Utils.valuesInObject(encodeKeys).join("");
  newLines.push(" ".repeat(keySize));
  newLines.push(keysWhiteSpaceStr);
  newLines.push(charsWhiteSpaceStr);
  
  return newLines.join('\n')
}

/*
recovers a hidden message in whitespace and decrypts it. 
*/
export function decodeMessage(fileText, alphabet = [" ","\t"]) {
  let lines = fileText.split("\n");

  //EXTRACT DECODE KEYS
  let charsWhiteSpace = lines.pop();
  let keysWhiteSpace = lines.pop();
  let keySize = lines.pop().length;
  
  //EXTRACT DECODED CHARS
  let encodedCharsArr = getCharsArrFromLines(lines, keySize);
  console.log(encodedCharsArr)
  //MAKE DECODE KEYS & DECODE CHARS
  let keysArr = keysArrFromWhiteSpace(keysWhiteSpace);
  let charsArr = Utils.splitNChars(charsWhiteSpace, keySize);
  
  let decodeKeys = objectFromArrs(keysArr, charsArr);
  let messageArr = Encoder.encodeCharsArr(encodedCharsArr, decodeKeys)
  console.log(messageArr)
  //DECRYPT
  var decrypted = CryptoJS.AES.decrypt(messageArr.join(""), AES_KEY);
  console.log(decrypted.toString(CryptoJS.enc.Utf8))
  return decrypted.toString(CryptoJS.enc.Utf8);
}

expect(
  decodeMessage(hideMessage("tacto", fileText))
).toEqual("tacto");

expect(
  decodeMessage(hideMessage("sammy is awesome", fileText))
).toEqual("sammy is awesome");

function addCharsToFileText(fileText, translatedCharArr) {
  //makes cleanlines
  let lines = fileText.split("\n").map( t => rTrim(t) );
  let newLines = [];
  
  try {   
    lines.forEach ( line => {
      for (var i = 0; i < CHARACTERS_PER_LINE; i++) {
        if ( translatedCharArr.length != 0 ) {
          line += translatedCharArr.shift();
        }
      }
      newLines.push(line);
    })
    if ( translatedCharArr.length > 0) {
      throw "file not enough lines to store message"
    }
  } catch(err) {
    alert( err );
    return [];
  }
    
  return newLines;
}

function getCharsArrFromLines(lines, keySize) {
  let numChars = keySize * CHARACTERS_PER_LINE;
  let arr = [];
  lines.forEach( line => {
    let chars = line.slice(line.length - numChars, line.length)
    for ( var i = 0; i < CHARACTERS_PER_LINE; i++ ) {
      let char = chars.slice(i*keySize, i*keySize+keySize)
      arr.push(char);
    }
  })
  return arr;
}

function objectFromArrs(keysArr, charsArr) {  
  let key = {};
  for ( var i = 0; i < keysArr.length; i++ ) {
    key[charsArr[i]] = keysArr[i];
  }
  return key;
}

expect(
  objectFromArrs(["00", "01", "10", "00", "11"], ["t", "a", "c", "t", "o"])
).toEqual({ a: '01', c: '10', o: '11', t: '00' });

function keysArrFromWhiteSpace(whiteSpace){
  let keysBinArr = Utils.splitNChars(whiteSpace, 8);  
  return keysBinArr.map( t => binaryToChar( Encoder.encodeCharStr(t, WHITE_SPACE_TO_BINARY_KEY) ) );
}

expect(
  keysArrFromWhiteSpace(" \t\t   \t\t \t\t\t \t  ")
).toEqual(["c","t"]);

function binaryToChar(str) {
  return String.fromCharCode(parseInt(str, 2));
}

expect(
  binaryToChar("01100011")
).toEqual("c");

function charTo8bitBinary(char) {
  return Utils.ljust("0", 8, char.charCodeAt(0).toString(2))
}

expect(
  charTo8bitBinary("t")
).toEqual("01110100"); 

expect(
  charTo8bitBinary("c")
).toEqual("01100011");

function rTrim(line){
  return line.replace(/\s+$/g, '');
}

expect(
  rTrim(" a  ")
).toEqual(" a");

expect(
  rTrim(" a\t  \t")
).toEqual(" a");

console.log("tests passed!");
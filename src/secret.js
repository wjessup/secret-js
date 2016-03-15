import CryptoJS from 'crypto-js';
import Utils from './utils'
import Encoder from './encoder'

const CHARACTERS_PER_LINE = 2;
const AES_KEY = "secretKey";

/*
Encrypts and hides a message in the whitespace along with the encodeKeys in 
the bottom 3 lines of the file. 
*/
export function hideMessage(message, fileText, alphabet = [" ","\t"]){
  
  //ENCRYPT
  var encrypted = '' + CryptoJS.AES.encrypt(message, AES_KEY);
  
  //ENCODE CHARS
  let keySize = Encoder.getKeySize(encrypted, alphabet);
  let encodeKeys = Encoder.makeEncodeKeys(encrypted, alphabet, keySize);
  let encodedCharArr = Encoder.encodeCharsArr(encodeKeys, encrypted);

  //INSERT ENCODED CHARS
  let newLines = addCharsToFileText(fileText, encodedCharArr);

  //INSERT ENCODE KEYS
  let keysWhiteSpace = Encoder.keysToWhiteSpace(encodeKeys);
  let charsWhiteSpace = Utils.valuesInObject(encodeKeys).join("");
  newLines.push(" ".repeat(keySize));
  newLines.push(keysWhiteSpace);
  newLines.push(charsWhiteSpace);

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

  //MAKE DECODE KEYS & DECODE CHARS
  let decodeKeys = Encoder.makeDecodeKeys(keysWhiteSpace, charsWhiteSpace, keySize);
  let charsArr = Encoder.decodeCharsArr(encodedCharsArr, decodeKeys)
  
  //DECRYPT
  var decrypted = CryptoJS.AES.decrypt(charsArr.join(""), AES_KEY);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

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
      
  }
  catch(err) {
      alert( err );
      return [];
  }
    
  return newLines;
}

function getCharsArrFromLines(lines, keySize) {
  let numChars = keySize * CHARACTERS_PER_LINE;
  let arr = [];
  lines.forEach( line => {
    let chars = line.slice(line.length - numChars,line.length)
    for ( var i = 0; i < CHARACTERS_PER_LINE; i++ ) {
      let char = chars.slice(i*keySize,i*keySize+keySize)
      arr.push(char);
    }
  })
  return arr;
}

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
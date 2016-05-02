import expect from 'expect';
let secret = require("../src/secret.js");

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

expect(
  secret.decodeMessage(secret.hideMessage("tacto", fileText))
).toEqual("tacto");

expect(
  secret.decodeMessage(secret.hideMessage("sammy is awesome", fileText))
).toEqual("sammy is awesome");

expect(
  secret.objectFromArrs(["00", "01", "10", "00", "11"], ["t", "a", "c", "t", "o"])
).toEqual({ a: '01', c: '10', o: '11', t: '00' });

expect(
  secret.keysArrFromWhiteSpace(" \t\t   \t\t \t\t\t \t  ")
).toEqual(["c","t"]);

expect(
  secret.binaryToChar("01100011")
).toEqual("c");

expect(
  secret.charTo8bitBinary("t")
).toEqual("01110100"); 

expect(
  secret.charTo8bitBinary("c")
).toEqual("01100011");

expect(
  secret.rTrim(" a  ")
).toEqual(" a");

expect(
  secret.rTrim(" a\t  \t")
).toEqual(" a");

console.log("tests passed!");
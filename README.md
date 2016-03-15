# secret-js

store a message into whitespace.

## getting started

just run npm start and go to localhost:3000

enter a message and select a textfile to hide the message in. 

You can see the original file on the left and the file w/ the hidden message on the right. 

## hiding the message

the message is encrypted using AES.

then, encode keys are created that map each character in the message to a binary number. For example:

`
expect(
  makeEncodeKeys("tacto",["0","1"],2)
).toEqual({t:"00", a:"01", c:"10", t:"00", o:"11"});
`

the encode keys are use to encode the original message into an array of characters

`
expect(
  encodeMessageWithEncodeKeys({ a: '01', c: '10', o: '11', t: '00' }, "tacto")
).toEqual(["00", "01", "10", "00", "11"]);
`

The encoded characters are translated to binary where spaces represent 0's and tabs represent 1's. Then, the encodekeys themselves are 
translated to binary, then whitespace.

The characters are added to the end of each line, by default 2 characters per line. 

The translated encodeKeys are then added to the bottom of the file over 3 lines that store specific info: the keySize, the keys in the encodeKeys & the values in the encodeKeys. 

## retrieving the message

First, the bottom 3 lines of the file are separate into their component parts: the keySize, the keys in the encodeKeys & the values in the encodeKeys. 

The keys are translated back to binary and then ascii characters. A new decodeKey is constructed using the whitespace values & the ascii key characters. 

The file is split into lines and the whitespace at the end is gathered into an array that is then translated with the decode key into ascii characters. 

Then the characters are decrypted with AES.


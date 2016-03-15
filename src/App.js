import React, { Component } from 'react';
import { hideMessage, decodeMessage } from './secret'

export class App extends Component {
  constructor(props) {
    super(props);
  }

  handleFile(e, message) {
    console.log("message = " + message);
    var reader = new FileReader();
    var file = e.target.files[0]
    reader.onload = function(e) {
      document.getElementById("textArea").value = e.target.result;
      var newFile = hideMessage(message, e.target.result);
      document.getElementById("textArea2").value = newFile;
    };
    reader.readAsText(file);
  }

  decode(e) {
    var file = document.getElementById("textArea2").value;
    var result = decodeMessage(file);

    console.log(result);
    document.getElementById("message").innerHTML = result;
  }

  execute(e) {

    var file = document.getElementById("textArea2").value;
    var result = decodeMessage(file);

    eval(result);
  }

  render() {
    return (
      <div>
        <div>write secret message to hide:</div>
        <input type="text" ref={(c) => this._input = c}  />
        <input type="file" id="fileInput" onChange={(event) => {
            this.handleFile(event, this._input.value);
          }} />
        <br />


        <div style={{float: "left"}}>
          <div>original file:</div>
          <textarea rows="30" cols="90" id="textArea"  />
        </div>
        <div style={{float: "left"}}>
          <div>file with secret message:</div>
          <textarea rows="30" cols="90" id="textArea2"  />
          <br />
          <button onClick={this.decode}>Get Secret Message</button>
          <button onClick={this.execute}>Execute Secret Code</button>
          <div id="message"></div>
        </div>

        <div style={{clear:"both"}}></div>
        <br />


      </div>
    );
  }
}

import './App.css';
import React from 'react';
import buttonStorage from './buttonStorage';
import TapeEngine from './businesslogic/TapeEngine';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      out: '',
      focus: '0'
    }

    this.refOutput = React.createRef();
    this.refButtons = React.createRef();
  }
  
  componentDidMount() {
    const buttons = Array.from(this.refButtons.current.querySelectorAll('button'));
    buttons.forEach(e => e.style.height = e.offsetWidth + 'px');
  }

  componentDidUpdate() {
    const buttons = Array.from(this.refButtons.current.querySelectorAll('button'));
    buttons.forEach(e => e.style.height = e.offsetWidth + 'px');
  }

  onKeyPress(event) {
    let output = this.refOutput.current;

    if (event.key === 'Enter') {
      new TapeEngine('=', output.value, output.className).tape();
    }
  }

  onButtonClick(item) {
    let output = this.refOutput.current;
    let tapeEngine = new TapeEngine(item, output.value, output.className);
    
    tapeEngine.tape();
    output.value = tapeEngine.output.value;
    let classList = tapeEngine.output.classList;
    output.classList = [];

    for (let i = 0; i < classList.length; i++) {
      output.classList.add(classList[i]);
    }
  }

  render() {
    return (
      <div className="calculator">
        <div className="calculator-result">
          <input ref={this.refOutput} onKeyPress={(e) => {this.onKeyPress(e)}} className="calculator-result-expression" 
          defaultValue={this.state.out} id="input" placeholder='0'
          ></input>
        </div>

        <div ref={this.refButtons} className="calculator-buttons">
          {buttonStorage.buttons.map((item, index) => <button
          key={index} className={item.type + ' ' + item.color} onClick={() => {this.onButtonClick(item)}}
          >{item.value}</button>)}
        </div>
      </div>
    );
  }
}

export default App;
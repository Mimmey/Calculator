class CalculationEngine {

  constructor(expression) {
    this.expression = expression;
  }

  reorganizeArray(array) {
    let reorganized = [];
    let k = -1;
    
    while (++k < array.length) {
      if (array[k] !== false) {
        reorganized.push(array[k]);
      }
    }

    return reorganized;
  }

  mergeMinusesForOp(array, pointer) {
    let sign = 0;

    while (array[pointer] === '-') {
      array[pointer] = false;
      pointer++;
      sign++;
    }

    if (sign % 2 !== 0) {
      array[pointer] *= -1; 
    }

    return this.reorganizeArray(array);
  }

  mergeMinuses(array) {
    let pointer = 0;
    array = this.mergeMinusesForOp(array, pointer);

    pointer += 2;
    array = this.mergeMinusesForOp(array, pointer);

    return this.reorganizeArray(array);
  }
  
  doTheMath(op, array) {
    let t1 = op - 1;
    let t2 = op + 1;

    let v1 = array[t1];
    let v2 = array[t2];

    switch (array[op]) {
      case '^':
        array[t2] = Math.pow(parseFloat(v1), parseFloat(v2));
        break;
      case '*':
        array[t2] = parseFloat(v1) * parseFloat(v2);
        break;
      case '/':
        array[t2] = parseFloat(v1) / parseFloat(v2);
        break;
      case '+':
        array[t2] = parseFloat(v1) + parseFloat(v2);
        break;
      case '-':
        array[t2] = parseFloat(v1) - parseFloat(v2);
        break;
      default: 
        return NaN;  
    }

    array[op] = false;
    array[t1] = false;
  
    return this.reorganizeArray(array);
  }
  
  calculate(string){

    // break the string into numbers and operators
    let cArray = (string.match(/([0-9]+\.[0-9]+)|([0-9]+)|\+|-|\^|\*|\//g));
    let i = -1;
    cArray = this.mergeMinuses(cArray);

    if (!cArray) {
      return string;
    }

    if (cArray.length === 1) {
      return cArray[0];
    }

    // degree
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '^') {
        cArray = this.doTheMath(i, cArray);
        i = i - 1;
      }
    }
    
    // multiplications
    i = -1;
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '*') {
        cArray = this.doTheMath(i, cArray);
        i = i - 1;
      }
    }
  
    // divisions
    i = -1;
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '/') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
    }
      
    // sum/substract
    i = -1;
    while (i++ < cArray.length - 1) {
      if (cArray[i] === '+') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
  
      if (cArray[i] === '-') {
        cArray = this.doTheMath(i, cArray);
        i--;
      }
    }
    return cArray[0];
  }
  
  calculateFull() {
    let str = this.expression;
    // clean the string from spaces
    str = str.replace(/ /g,'');
  
    // declare the final result variable
    let result = str;
  
    // brake the strings there are between parentheses
    let subCalculations = str.match(/\(([^()]+)\)/gmi); 
    let subCalc;
  
    if (!subCalculations) {
      return this.calculate(str);
    }
  
    for (let k = 0; k < subCalculations.length; k++) {
      subCalc = subCalculations[k].replace(/\(|\)/g, '');
      console.log('Replacing (' + subCalc + ') by ' + this.calculate(subCalc));
      result = result.replace('('+subCalc+')', this.calculate(subCalc));
    }
  
    // verify if the string still have parentheses and recursively resolves them
    if (result.indexOf('(') >= 0) {
      return this.calculateFull(result);
    }
  
    console.log("String after subcalculations are done: " + result);
    return this.calculate(result);
  }
}

export default CalculationEngine;
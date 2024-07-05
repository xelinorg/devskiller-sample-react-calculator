import React from "react";

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const complex = ['*', '/'];
const ops = ['+', '-'].concat(complex);

const getLast = (seq: string[]) => {
  return seq[seq.length - 1];
};

const isNumber = (token: string) => Number.isInteger(Number.parseInt(token));

const toNumber = (token: string) => {
  return token.indexOf('.') >= 0 ? Number.parseFloat(token) : Number.parseInt(token);
};

const doCalc = (alpha: string, beta: string, op: string) => {
  let res;
  const a = toNumber(alpha);
  const b = toNumber(beta);

  switch(op) {
    case '+':
      res = a + b;
      break;
    case '-':
      res = a - b;
      break;
    case '/':
      if (alpha === '0'){
        res = 'Error'
      } else {
        res = a / b;
      }
      break;
    case '*':
      res = a * b;
      break;
    default:
      res = 'Error';
  }
  return res.toString();
}

const calcComplex = (complexCalc: string[]) => {
  if (complexCalc.length) {
    const rightNumber = complexCalc.pop();
    const complexOp = complexCalc.pop();
    const leftNumber = complexCalc.pop();
    if (leftNumber && rightNumber && complexOp){
      complexCalc.push(doCalc(leftNumber, rightNumber, complexOp));
    }
  }

  return complexCalc;
};

function App() {
  // TODO: implement logic of the calculator interface!
  const handleClick = (e: any) => {
    e.preventDefault();
    const isTarget = e.target.dataset.testid;
    if (isTarget){
      const inner = e.target.innerHTML;
      const last = getLast(displaySeq);
      let newDisplay = [...displaySeq];
      let newCalc = [...calcSeq];

      if (ops.includes(inner) && inner && displaySeq.length) {
        // check complex
        if (newCalc.length && complex.includes(newDisplay[newDisplay.length -2])) {
          newCalc = calcComplex(newCalc);
        }
        if (ops.includes(last)) {
          newDisplay[newDisplay.length -1] = inner;
          newCalc[newCalc.length -1] = inner;
        } else {
          newDisplay.push(inner);
          newCalc.push(inner);
        }
      }

      if (numbers.includes(inner)){
        if (isNumber(last)) {
          newDisplay[newDisplay.length -1] = last.concat(inner);
          newCalc[newCalc.length -1] = last.concat(inner);
        } else {
          newDisplay.push(inner);
          newCalc.push(inner);
        }
      }

      if (inner === 'C') {
        newDisplay = [];
      }

      if (inner === '=') {
        if (newCalc.length && complex.includes(newDisplay[newDisplay.length -2])) {
          newCalc = calcComplex(newCalc);
        }
        const calc = newCalc.reduce((acc: any, cur: any) => {
          if (!acc.total && isNumber(cur)){
            acc.total = cur;
          }
          if (ops.includes(cur)){
            acc.op = cur;
          } 
          if (acc.total && isNumber(cur) && acc.op){
            acc.total =  doCalc(acc.total , cur, acc.op);
          } 
          return acc;
        }, {total: 0, op: null})

        setTotal(calc.total);
      }
      
      setDisplaySeq(newDisplay);
      setCalcSeq(newCalc);
    }
  };

  const [displaySeq, setDisplaySeq] = React.useState<string[]>([]);
  const [calcSeq, setCalcSeq] = React.useState<string[]>([]);
  const [calcDisplay, setCalcDisplay] = React.useState('');
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    // console.log('calcSeq', calcSeq);
    // console.log('displaySeq', displaySeq);
    setCalcDisplay(displaySeq.join(''));
  }, [displaySeq]);

  React.useEffect(()=> {
    if (total){
      setCalcDisplay(total.toString());
    }
  },[total]);

  return (
    <div className="calculator" onClick={handleClick}>
      <input data-testid="display" className="display" type="text" disabled value={calcDisplay}></input>

      <div className="btn-container">
        <button data-testid="btn-clear" className="btn wide">C</button>
        <button data-testid="btn-div" className="btn">/</button>

        <button data-testid="btn-7" className="btn">7</button>
        <button data-testid="btn-8" className="btn">8</button>
        <button data-testid="btn-9" className="btn">9</button>
        <button data-testid="btn-mul" className="btn">*</button>

        <button data-testid="btn-4" className="btn">4</button>
        <button data-testid="btn-5" className="btn">5</button>
        <button data-testid="btn-6" className="btn">6</button>
        <button data-testid="btn-sub" className="btn">-</button>

        <button data-testid="btn-1" className="btn">1</button>
        <button data-testid="btn-2" className="btn">2</button>
        <button data-testid="btn-3" className="btn">3</button>
        <button data-testid="btn-add" className="btn">+</button>

        <button data-testid="btn-0" className="btn wide">0</button>
        <button data-testid="btn-eval" className="btn">=</button>
      </div>
    </div>
  );
}

export default App;

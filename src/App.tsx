import React from "react";

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const complexOps = ['*', '/'];
const ops = ['+', '-'].concat(complexOps);

const toNumber = (token: string) => {
  return token.indexOf('.') >= 0 ? Number.parseFloat(token) : Number.parseInt(token);
};

const isNumber = (token: string) => Number.isInteger(Number.parseInt(token));

const getLast = (seq: string[]) => {
  return seq[seq.length - 1];
};

const addToken = (seq: string[], token: string) => {
  const last = getLast(seq);
  const newSeq = [...seq];

  if (last) {
    if (isNumber(last) && numbers.includes(token)){
      newSeq[newSeq.length -1] = last.concat(token);
    }
  
    if (isNumber(last) && ops.includes(token)){
      newSeq.push(token);
    }
  
    if (ops.includes(last) && ops.includes(token)){
      newSeq[newSeq.length -1] = token;
    }
  
    if (ops.includes(last) && numbers.includes(token)){
      newSeq.push(token);
    }
  } else {
    if (isNumber(token)){
      newSeq.push(token);
    }
  }

  return newSeq;
};

const doCalc = (alpha: string, beta: string, op: string) => {
  let result;
  const a = toNumber(alpha);
  const b = toNumber(beta);
  switch (op){
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      result = a / b;
      break;
    default:
      result = 'Error'
  }

  return result.toString();
}

const reduceOps = (seq: string[]) => {
  const newSeq = [...seq];
  const b = newSeq.pop();
  const op = newSeq.pop();
  const a = newSeq.pop();
  if (b && op && a) {
    newSeq.push(doCalc(a, b, op));
  }
  return newSeq;
};

const calcTotal = (seq: string[]) => {
  const calc = seq.reduce((acc: any, cur: any) => {
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
  return calc.total;
};

const reducer = (state: any, action: any) => {
  switch (action.type){
    case 'number':
      return {
        display: addToken(state.display, action.payload),
        seq: addToken(state.seq, action.payload)
      }
    case 'op':
      let seq = addToken(state.seq, action.payload);
      if (complexOps.includes(state.seq[state.seq.length -2])){
        seq = reduceOps(state.seq);
        seq.push(action.payload);
      }
      return {
        display: addToken(state.display, action.payload),
        seq
      }
    case 'clear':
      return {
        display: [],
        seq: []
      }
    case 'total':
      let total;
      if (complexOps.includes(state.seq[state.seq.length -2])){
        total = calcTotal(reduceOps(state.seq));
      } else {
        total = calcTotal(state.seq);
      }
      return {
        display: [total],
        seq: [total]
      }
  }
  return state;
};

function App() {
  // TODO: implement logic of the calculator interface!

  const handleClick = (e: any) => {
    const {innerHTML, dataset} = e.target;

    if (dataset.testid && innerHTML){
      if (numbers.includes(innerHTML)) {
        dispatch({type: 'number', payload: innerHTML});
      }

      if (ops.includes(innerHTML)){
        dispatch({type: 'op', payload: innerHTML});
      }

      if (innerHTML === 'C'){
        dispatch({type: 'clear'});
      }

      if(innerHTML === '='){
        dispatch({type: 'total'});
      }
    }
  };

  const [state, dispatch] = React.useReducer(reducer, {display: [], seq: []});

  return (
    <div className="calculator">
      <input data-testid="display" className="display" type="text" value={state.display.join('')} disabled></input>

      <div className="btn-container" onClick={handleClick}>
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

import React, {useState, useEffect} from 'react';
import TimeDayScoreContainer from './status/TimeDayScoreContainer';

let g = window;
const InputOutput = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [message, setMessage] = useState([]);
  const [status, setStatus] = useState([]);
  console.log(g.core);

  let currentMsg = '';
  useEffect(() => {
    g.q.addQueueWrittenEventListener('status', SQWHandler);
    let interval = setInterval(() => {
      if (g.msgQueue.length > 0) {
        currentMsg = g.msgQueue.pop();
        setOutput([...output, <div>{currentMsg}</div>]);
      }
    }, 200);
  }, []);

  const SQWHandler = () => {
    //setOutput([...output, <div>{currentMsg}</div>]);
    //console.log(g.q.status.pop());
    //setStatus(g.q.status.pop());
    setStatus(g.q.status[g.q.status.length - 1]);
  };
  const onKeyDownHandler = (evt) => {
    if (evt.key === 'Enter') {
      const input = evt.target.value;
      const result = window.core.isStillAliveGameLoop(
        input,
        g.c.inventory,
        g.c.vitals,
        g.c.actions
      );
      console.log('result=', result);
      console.log('queue:', g.msgQueue);
    }
  };
  const onChangeHandler = (evt) => {
    setInput(evt.target.value);
  };
  return (
    <div id='input-output'>
      <input
        id='command-input'
        className='io'
        type='text'
        value={input}
        onKeyDown={onKeyDownHandler}
        onChange={onChangeHandler}
      ></input>
      {/*       <TimeDayScoreContainer /> */}
      <div
        id='output'
        className='io'
      >
        {output.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div
        id='status'
        className='io'
      >
        <div>{status}</div>
      </div>
    </div>
  );
};

export default InputOutput;

import React from 'react';

const InputOutput = () => {
  return (
    <div id='input-output'>
      <input
        id='command-input'
        className='io'
        type='text'
      ></input>
      <div
        id='output'
        className='io'
      ></div>
    </div>
  );
};

export default InputOutput;

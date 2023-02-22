import React from 'react';

const InputOutput = () => {
  return (
    <>
      <input
        id='command-input'
        className='io'
        type='text'
      ></input>
      <div
        id='output'
        className='io'
      ></div>
    </>
  );
};

export default InputOutput;

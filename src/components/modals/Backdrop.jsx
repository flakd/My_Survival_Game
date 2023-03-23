import React from 'react';

const Backdrop = (props) => {
  return (
    <div
      id='generic_backdrop'
      onClick={props.closeModal}
    ></div>
  );
};

export default Backdrop;

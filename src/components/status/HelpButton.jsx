import React from 'react';

const HelpButton = (props) => {
  return (
    <button
      type='button'
      id='help_button'
      className='btn btn-dark'
      onClick={props.showModal}
    >
      Help
    </button>
  );
};

export default HelpButton;

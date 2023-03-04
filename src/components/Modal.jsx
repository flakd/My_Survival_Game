import React from 'react';

const Modal = (props) => {
  return (
    <div id='generic_modal'>
      <button
        id='cancel'
        type='button'
        onClick={props.closeModal}
      >
        Cancel
      </button>
      <button
        id='confirm'
        type='button'
        onClick={props.closeModal}
      >
        Confirm
      </button>
    </div>
  );
};

export default Modal;

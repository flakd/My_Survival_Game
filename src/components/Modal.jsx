import React from 'react';

const Modal = (props) => {
  return (
    <div id='generic_modal'>
      <h4>{props.title}</h4>
      <hr></hr>
      {props.content}
      <hr></hr>
      {props.secButton && (
        <button
          id='cancel'
          type='button'
          className='m-2 btn btn-secondary'
          onClick={props.closeModal}
        >
          {props.secButton}
        </button>
      )}
      <button
        id='confirm'
        type='button'
        className='btn btn-primary'
        onClick={props.closeModal}
      >
        {props.priButton}
      </button>
    </div>
  );
};

export default Modal;

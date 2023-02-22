import React from 'react';

const WelcomeModal = () => {
  return (
    <div>
      <div
        name='flakModal'
        className='modal fade'
        id='staticBackdrop'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='staticBackdropLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1
                className='modal-title fs-5'
                id='staticBackdropLabel'
              >
                Welcome to the Survival Game!
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              Thanks so much for trying out my game. It's still in pre-alpha, so
              please forgive the unfinished state. But, I hope it gives you an
              idea of what I have done/can do. Thanks again for visiting.
            </div>
            <div className='modal-footer'>
              <button
                id='myInput'
                type='button'
                className='btn btn-secondary'
                data-bs-dismiss='modal'
              >
                Let's Play!
              </button>
              {/*<!-- <button type="button" className="btn btn-primary">Understood</button> -->*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

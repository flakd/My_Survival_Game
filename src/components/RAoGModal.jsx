import React from 'react';

const RAoGModal = () => {
  function handleBtnCloseRAoGImgModal_click(sender) {
    //RAoGAudioClip.pause();
    //RAoGImgModal.style.display = 'none';
  }
  return (
    <div id='RAoG-image-modal'>
      <img
        id='RAoG-image'
        alt='Random Act of God'
        src='images/had-a-bear-attack.png'
      />
      <div>
        <button
          id='btnClose_RAoG-image-modal'
          onClick={handleBtnCloseRAoGImgModal_click}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default RAoGModal;

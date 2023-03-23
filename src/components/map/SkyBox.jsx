import React from 'react';

const SkyBox = () => {
  return (
    <div id='sky-box'>
      <div
        id='sun-or-moon-container'
        class='sky'
      >
        <img
          id='sun'
          src='images/hand-drawn-sun2.png'
          alt='sun'
        />
        <img
          id='moon'
          src='images/moon2.png'
          alt='moon'
        />
      </div>
      {/*<!-- CLOSE id="sun-or-moon-container"-->*/}
    </div>
  );
};

export default SkyBox;

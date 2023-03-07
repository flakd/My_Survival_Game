import React, {useEffect, useCallback, useState} from 'react';
import AnimatedImage from './../images/Indy_anim_trans.gif';
import StaticImage from './../images/Indy_nonanim_trans.gif';
import FishingRod from './../images/player_fishing_rod--anim--trans.gif';

let g = window;

const Player = () => {
  const [top, setTop] = useState(270);
  const [left, setLeft] = useState(235);
  const [directionCSS_X, setDirectionCSS_X] = useState(g.p.directionCSS_X);
  const [directionCSS_Y, setDirectionCSS_Y] = useState(g.p.directionCSS_Y);

  const startXIdx = 5; // out of 10 squares wide
  const startYIdx = 6; // out of 10 squares high
  //const playerLabel = `player_${startYIdx}${startXIdx}`;
  const playerLbl1 = `player_anim`;
  const playerLbl2 = `player_static`;

  const moveKeysHandler = useCallback((event) => {
    console.log('key=', event.key);
    if (event.key === 'w') {
      const newTop = g.p.newTop - 40;
      const newLeft = g.p.newLeft;

      setTop(newTop);
      setLeft(newLeft);

      setDirectionCSS_X(g.p.directionCSS_X);
      //setDirectionCSS_Y(g.p.directionCSS_Y);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', moveKeysHandler, false);

    return () => {
      document.removeEventListener('keydown', moveKeysHandler, false);
    };
  }, [moveKeysHandler]);

  /*   const setupPlayerMovement = () => {
    const player = document.getElementById(playerLabel);
    if (!player) {
      console.log(`ERROR: Can't find **${playerLabel}**`);
      //breakpoint;
    } else {
      player.style.display = 'block';
    }
  }; */

  return (
    <div
    /* style={{top: '160px', left: '180px'}} */
    >
      🚶🏻
      <img
        id={playerLbl1}
        className='player'
        src={AnimatedImage}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: '60px',
          height: '45px',
          display: 'none',
        }}
      />
      <img
        id={playerLbl2}
        className='player'
        src={StaticImage}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: '60px',
          height: '45px',
        }}
      />
      <img
        id='fishing-rod'
        className='player'
        src={FishingRod}
        style={{
          top: `${top}px`,
          left: `${left + 15}px`,
          width: '55px',
          height: '35px',
          transform: 'rotate(20deg)',
          WebkitTransform: 'rotate(20deg)',
          transform: directionCSS_X,
          WebkitTransform: directionCSS_X,
        }}
      />
    </div>
  );
};

export default Player;

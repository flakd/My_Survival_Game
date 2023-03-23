import React, {useEffect, useCallback, useState} from 'react';
import AnimatedImage from '../../images/Indy_anim_trans.gif';
import StaticImage from '../../images/Indy_nonanim_trans.gif';
import FishingRod from '../../images/player_fishing_rod--anim--trans.gif';
import PlayerHelper from '../../helpers/PlayerHelper';
import Campfire from '../../images/Campfire_anim_trans.gif';

let g = window;

const Player = () => {
  const [top, setTop] = useState(268);
  const [left, setLeft] = useState(230);
  const [directionCSS_X, setDirectionCSS_X] = useState(g.p.directionCSS_X);

  const playerLbl1 = `player_anim`;
  const playerLbl2 = `player_static`;
  PlayerHelper();
  g.p.dirLegend.fishOffsetRight = 20;
  g.p.dirLegend.fishOffsetLeft = -15;

  const moveKeysHandler = useCallback((event) => {
    console.log('key=', event.key);
    if (event.key === 'w') {
      const newTop = g.p.newTop - 40;
      const newLeft = g.p.newLeft;

      setTop(newTop);
      setLeft(newLeft);

      setDirectionCSS_X(g.p.directionCSS_X);
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
      {/*  🚶🏻 */}
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
        className='player-map-items'
        src={FishingRod}
        style={{
          top: `${top - 10}px`,
          left: `${left + 20}px`,
          width: '55px',
          height: '45px',
          transform: 'rotate(20deg)',
          WebkitTransform: 'rotate(20deg)',
          transform: directionCSS_X,
          WebkitTransform: directionCSS_X,
          display: 'none',
        }}
      />
      <img
        id='campfire'
        className='player-map-items'
        src={Campfire}
        style={{
          top: `${top - 10}px`,
          left: `${left + 20}px`,
          width: '30px',
          height: '30px',
          display: 'none',
        }}
      />
    </div>
  );
};

export default Player;

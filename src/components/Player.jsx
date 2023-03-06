import React, {useEffect, useCallback, useState} from 'react';

const Player = () => {
  const [top, setTop] = useState(260);
  const [left, setLeft] = useState(240);
  const [topStr, setTopStr] = useState(260);
  const [leftStr, setLeftStr] = useState(240);
  /*   let topStr;
  let leftStr; */

  const startXIdx = 5; // out of 10 squares wide
  const startYIdx = 6; // out of 10 squares high
  const playerLabel = `player_${startYIdx}${startXIdx}`;

  const moveKeysHandler = useCallback((event) => {
    console.log('key=', event.key);
    if (event.key === 'w') {
      const newTop = top - 40;
      const newLeft = left;
      setTop(newTop);
      setLeft(newLeft);
      /*       topStr = top + 'px';
      leftStr = left + 'px'; */

      setTopStr(newTop + 'px');
      setLeftStr(newLeft + 'px');
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
      id={playerLabel + '_b'}
      className='player'
      style={{top: topStr, left: leftStr}}
      /* style={{top: '160px', left: '180px'}} */
    >
      🚶🏻
    </div>
  );
};

export default Player;

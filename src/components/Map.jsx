import React from 'react';
import {
  getMapAsList,
  getSeafood,
  getLandResource,
  getFish,
} from './../setupMap';
import {randomIntFromInterval} from './../helpers/misc';
const g = window;

const Map = () => {
  const myMap = getMapAsList();
  //test();

  console.log(myMap);

  const generateJSXArray = (gridAsList) => {
    let HTML = [];
    let classList;

    for (let i = 0; i < gridAsList.length; i++) {
      let playerJSX = [];

      const cell = gridAsList[i];
      const cellValue = cell[0];
      const cellX = cell[1];
      const cellY = cell[2];

      const idStr = i.toString().padStart(2, '0');
      const name = cellX + ',' + cellY;
      let classList = 'cell';

      if (cellValue === 1 || cellValue === 2) {
        playerJSX.push(
          <span
            key={'player_' + idStr}
            id={'player_' + idStr}
            className='player'
          >
            🚶🏻
          </span>
        );
      }
      let resource;
      if (cellValue === 0) {
        //classList += ' unwalkable ocean fish';
        resource = getSeafood();
      }
      if (cellValue === 1) {
        classList += ' filled walkable land'; //filled (green/land)
        resource = getLandResource();
      }
      if (cellValue === 2) {
        //classList += ' walkable water fish drink'; //filled (green/land)
        classList += ' water'; //filled (green/land)
        resource = getFish();
      }
      let resourceJSX;
      if (resource) {
        resourceJSX = (
          <div
            id={resource.id}
            className={resource.className}
          >
            {resource.emoji}
          </div>
        );
      } else {
        resourceJSX = null;
      }
      HTML.push(
        <div
          key={idStr}
          id={'cell_' + idStr}
          name={name}
          className={classList}
        >
          {playerJSX}
          {resourceJSX}
        </div>
      );
    }
    return HTML;
  };

  return (
    <>
      <div
        key='grid'
        id='grid'
      >
        {generateJSXArray(myMap).map((mapSquareAsJSX, idx) => mapSquareAsJSX)}
      </div>
    </>
  );
};

export default Map;

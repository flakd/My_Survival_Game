import React from 'react';
import {
  genInitMapMatrix,
  getTestMapMatrix,
  getMapAsList,
  getSeafood,
  getLandResource,
  getFish,
  fixLakesGPT,
} from './../helpers/setupMap';
//import mapLake from './../helpers/mapLake';
import {randomIntFromInterval} from './../helpers/misc';
const g = window;

const Map = () => {
  const initMap = genInitMapMatrix();
  const fixedMap = fixLakesGPT(initMap);
  const mapList = getMapAsList(fixedMap);
  //mapLake();

  //test();

  //console.log(myMap);

  const generateJSXArray = (gridAsList) => {
    let HTML = [];
    let classList;

    for (let i = 0; i < gridAsList.length; i++) {
      let playerJSX = [];

      const cell = gridAsList[i];
      let cellValue = cell[0];
      const cellX = cell[1];
      const cellY = cell[2];

      const idStr = i.toString().padStart(2, '0');
      const name = cellX + ',' + cellY;
      let classList = 'cell';

      /*       if (cellValue === 1 || cellValue === 20) {
        playerJSX.push(
          <span
            key={'player_' + idStr}
            id={'player_' + idStr}
            className='player_old'
          >
            🚶🏻
          </span>
        );
      } */
      let resource;
      if (cellValue === 0) {
        classList += ' shoreline';
      }
      if (cellValue === 0) {
        //classList += ' unwalkable ocean fish';
        resource = getSeafood();
      }
      if (cellValue === 10) {
        classList += ' filled walkable land'; //filled (green/land)
        resource = getLandResource();
        if (resource && resource.className === 'tree') {
          cellValue = g.m.TREE;
          console.log('TREE');
        } else if (resource && resource.className === 'mountain') {
          cellValue = g.m.STONE;
          console.log('STONE');
        }
      }
      if (cellValue === 20) {
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
          {/*           {playerJSX} */
          /*since I removed having the player icon in ever square */}
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
        {generateJSXArray(mapList).map((mapSquareAsJSX, idx) => mapSquareAsJSX)}
      </div>
    </>
  );
};

export default Map;

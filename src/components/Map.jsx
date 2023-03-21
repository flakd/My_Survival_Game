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
import mapShoreline from './../helpers/mapLake';
import {randomIntFromInterval} from './../helpers/misc';
const g = window;

const Map = () => {
  const initMap = genInitMapMatrix();
  //const initMap = getTestMapMatrix();

  const fixedMap = fixLakesGPT(initMap);

  //const fixedMap = mapShoreline();

  //const fixedMap = getTestMapMatrix();
  const mapList = getMapAsList(fixedMap);
  console.log('initMap: ', initMap);
  //const mapList = getMapAsList(initMap);
  console.log('mapList: ', mapList);

  //test();

  //console.log(myMap);

  const generateJSXArray = (gridAsList) => {
    let HTML = [];
    let classList;

    for (let i = 0; i < gridAsList.length; i++) {
      let playerJSX = [];

      const cell = gridAsList[i];
      const cellX = cell[0];
      const cellY = cell[1];
      //let cellValue = cell[2];
      let terrain = cell[2];
      let isShoreline = cell[3];
      let resourceName = cell[4];

      const idStr = i.toString().padStart(2, '0');
      const name = cellX + ',' + cellY;
      let classList = 'cell';

      let resourceObj;
      //if (terrain >= 500) {
      if (isShoreline) {
        classList += ' shoreline';
      }
      if (terrain === g.m.OCEAN) {
        //classList += ' unwalkable ocean fish';
        resourceObj = getSeafood();
        cell[4] = 'Seafood';
      }
      if (terrain === g.m.FLATLAND) {
        classList += ' filled walkable land'; //filled (green/land)
        resourceObj = getLandResource();
        if (resourceObj && resourceObj.className === 'tree') {
          terrain = g.m.TREE;
          cell[4] = 'Tree';
          console.log('resourceName:', resourceName);
        } else if (resourceObj && resourceObj.className === 'mountain') {
          terrain = g.m.STONE;
          cell[4] = 'Stone';
          console.log('resourceName:', resourceName);
        }
      }
      if (terrain === g.m.WATER) {
        //classList += ' walkable water fish drink'; //filled (green/land)
        classList += ' water'; //filled (green/land)
        resourceObj = getFish();
        cell[4] = 'Fish';
        console.log('resourceName:', resourceName);
      }
      let resourceJSX;
      if (resourceObj) {
        resourceJSX = (
          <div
            id={resourceObj.id}
            className={resourceObj.className}
          >
            {resourceObj.emoji}
          </div>
        );
      } else {
        resourceJSX = null;
        //resourceJSX = terrain;
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
    console.log(gridAsList);
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

//const fixedMap = mapLake();

export default Map;

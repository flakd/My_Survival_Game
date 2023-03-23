import React from 'react';
import {
  generateMapMatrixGPT,
  getTestMapMatrix,
  getMapAsList,
  getSeafood,
  getLandResource,
  getFish,
  fixLakesGPT,
} from './setupMap';
import mapShoreline from './mapLake';
import {randomIntFromInterval} from './../../helpers/misc';
const g = window;

const Map = () => {
  //const initMap = generateMapMatrixGPT();
  //const initMap = getTestMapMatrix();

  //const fixedMap = fixLakesGPT(initMap);

  //const fixedMap = mapShoreline();
  const fixedMap = generateMapMatrixGPT();
  const mapList = getMapAsList(fixedMap);
  //const mapList = getMapAsList(initMap);

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
      let terrain = cell[2][0];
      let isShoreline = cell[2][1];

      const idStr = i.toString().padStart(2, '0');
      const name = cellX + ',' + cellY;
      let classList = 'cell';

      let resource;
      //if (terrain >= 500) {
      if (isShoreline) {
        classList += ' shoreline';
      }
      if (terrain === g.m.OCEAN) {
        //classList += ' unwalkable ocean fish';
        resource = getSeafood();
      }
      if (terrain === g.m.FLATLAND) {
        classList += ' filled walkable land'; //filled (green/land)
        resource = getLandResource();
        if (resource && resource.className === 'tree') {
          terrain = g.m.TREE;
          console.log('TREE');
        } else if (resource && resource.className === 'mountain') {
          terrain = g.m.STONE;
          console.log('STONE');
        }
      }
      if (terrain === g.m.WATER) {
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
        //resourceJSX = null;
        resourceJSX = terrain;
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

//const fixedMap = mapLake();

export default Map;

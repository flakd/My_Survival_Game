import React from 'react';
import {getFlattenedMap, test, getLandResource, getFish} from './../setupMap';
import {randomIntFromInterval} from './../helpers/misc';
const g = window;

const Map = () => {
  const myMap = getFlattenedMap();
  test();

  console.log(myMap);

  /* function getMountain() {
    if (numMountains <= maxMountains) {
      const x = randomIntFromInterval(1, 2);
      if (x === 1) {
        //coin toss (50/50) whether to return a Mountain
        numMountains++;
        return (
          <div
            id={'mountain' + numMountains.toString().padStart(2, '0')}
            className='mountain'
          >
            🏔️
          </div>
        );
      }
    }
  }

  function getTree() {
    if (numTrees <= maxTrees) {
      const x = randomIntFromInterval(1, 2);
      if (x === 1) {
        //coin toss (50/50) whether to return a tree
        numTrees++;
        return (
          <div
            id={'tree_' + numTrees.toString().padStart(2, '0')}
            className='tree'
          >
            🌲
          </div>
        );
      }
    }
  } */

  /*   function getFish() {
    if (numFish <= maxFish) {
      //const x = randomIntFromInterval(1, 100);
      //if (x < 99) {
      //coin toss (50/50) whether to return a tree
      numFish++;
      return (
        <div
          id={'fish_' + numFish.toString().padStart(2, '0')}
          className='fish'
        >
          🐟
        </div>
      );
      //}
    }
  } */
  function getSeafood() {
    if (g.numSeafood <= g.maxSeafood) {
      const x = randomIntFromInterval(1, 2);
      if (x === 1) {
        //coin toss (50/50) whether to return some Seafood
        g.numSeafood++;
        return (
          <div
            id={'seafood_' + g.numSeafood.toString().padStart(2, '0')}
            className='seafood'
          >
            🐟
          </div>
        );
        //}
      }
    }
  }
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
            style={{display: 'none', zIndex: 100}}
          >
            🚶🏻
          </span>
        );
      }
      let resource;
      /*       if (cellValue === 0) {
        //classList += ' unwalkable ocean fish';
        resource = getSeafood();
      } */
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
        style={{zIndex: '3'}}
      >
        {generateJSXArray(myMap).map((mapSquareAsJSX, idx) => mapSquareAsJSX)}
      </div>
    </>
  );
};

export default Map;

import React from 'react';
import {createMapModel} from './../setupMap';

const Map = () => {
  const myMap = createMapModel();
  let startCellNumStr = '';

  let numCell = 0;
  let numCellStr = '';

  let numFilled = 0;
  let numFishes = 0;
  let numTrees = 0;
  let numMountains = 0;

  console.log(myMap);

  const determineContents = (matrix) => {
    let HTML = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const id = numCell.toString().padStart(2, '0');
        const name = x + ',' + y;
        let innerHTML = '';
        let classList = 'cell';
        if (matrix[y][x] === 1) {
          classList += ' filled';
          //if (startCellNum === null) startCellNum = numCell;
          numCellStr = numCell.toString().padStart(2, '0');
          if (startCellNumStr === '') startCellNumStr = numCellStr;
          innerHTML = (
            <span
              id={'player_' + numCellStr}
              className='player'
              style={{display: 'none', zIndex: 100}}
            >
              🚶🏻
            </span>
          );
          if (numFishes === 0) {
            innerHTML += (
              <div
                id={'fish_' + numCellStr}
                className='fish'
              >
                🐟
              </div>
            );
            numFishes++;
          } else if (numTrees === 0) {
            innerHTML += (
              <div
                id={'tree_' + numCellStr}
                className='tree'
              >
                🌲
              </div>
            );
            numTrees++;
          } else if (numMountains === 0) {
            innerHTML += (
              <div
                id={'mountain_' + numCellStr}
                className='mountain'
              >
                🏔️
              </div>
            );
            numMountains++;
          }
        }
        numCell++;
        HTML.push(
          <div
            id={id}
            name={name}
            className={classList}
          >
            {/* {innerHTML} */}
          </div>
        );
      }
    }
    return HTML;
  };

  return (
    <>
      <div
        id='grid'
        style={{zIndex: '3'}}
      >
        {determineContents(myMap).map((mapBlocks) => mapBlocks)}

        {/*<!-- Cells will be added here dynamically by JavaScript -->*/}
      </div>
    </>
  );
};

export default Map;

import React, {useEffect, useState} from 'react';

let g = window;
const StatusInventory = () => {
  const [inventory, setInventory] = useState(['test', 'test2']);

  useEffect(() => {
    let interval = setInterval(() => {
      const inventoryValues = Object.values(g.c.inventory);
      inventoryValues.sort(function (a, b) {
        if (a.key < b.key) {
          return -1;
        }
        if (a.key > b.key) {
          return 1;
        }
        return 0;
      });
      let t = 0;
      setInventory(Object.values(inventoryValues));
    }, 500);
  }, []);

  return (
    <div
      id='status-inventory'
      className='status'
    >
      {inventory
        .filter(
          (invItem) =>
            invItem.bal > 0 &&
            invItem.key !== 'default' &&
            invItem.key !== 'trees'
        )
        .map((invItem) => (
          <button
            key={invItem.key}
            type='button'
            className='inventory'
          >
            {invItem.key}:{invItem.bal}
          </button>
        ))}
    </div>
  );
};

export default StatusInventory;

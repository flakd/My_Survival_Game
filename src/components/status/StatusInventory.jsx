import React, {useEffect, useState} from 'react';

let g = window;
const StatusInventory = () => {
  const [inventory, setInventory] = useState(['test', 'test2']);

  useEffect(() => {
    let interval = setInterval(() => {
      setInventory(Object.values(g.c.inventory));
    }, 500);
  }, []);

  return (
    <div
      id='status-inventory'
      className='status'
    >
      {inventory
        .filter((invItem) => invItem.bal > 0)
        .map((invItem) => (
          <button
            key={invItem.key}
            type='button'
            className='vitals'
          >
            {invItem.key}:{invItem.bal}
          </button>
        ))}
    </div>
  );
};

export default StatusInventory;

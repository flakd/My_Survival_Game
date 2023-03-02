import React, {useEffect, useState} from 'react';

let g = window;
const StatusVitals = () => {
  const [vitals, setVitals] = useState(['test', 'test2']);

  useEffect(() => {
    let interval = setInterval(() => {
      setVitals(Object.values(g.c.vitals));
    }, 500);
  }, []);
  return (
    <div
      id='status-vitals'
      className='status'
    >
      {vitals
        .filter((vital) => vital.key !== 'default')
        .map((vital) => (
          <button
            key={vital.key}
            type='button'
            className='vitals'
          >
            {vital.key + ':' + vital.bal}
          </button>
        ))}
    </div>
  );
};

export default StatusVitals;

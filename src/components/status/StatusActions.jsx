import React, {useState, useEffect} from 'react';
//const core = require('./../../core');
//const output = require('./../../output');

let g = window;
const StatusActions = () => {
  const [actions, setActions] = useState(['test', 'test2']);

  useEffect(() => {
    let interval = setInterval(() => {
      setActions(Object.values(g.c.actions));
    }, 500);
  }, []);

  const onClickAction = (sender) => {
    const action = sender.target.value;
    console.log(action);
    g.core.isStillAliveGameLoop(action, g.c.inventory, g.c.vitals, g.c.actions);
  };

  return (
    <div
      id='status-actions'
      className='status'
    >
      {actions
        .filter((action) => action.key !== 'default')
        .map((action) => (
          <button
            key={action.key}
            type='button'
            className='vitals'
            value={action.key}
            onClick={onClickAction}
          >
            {action.key}
          </button>
        ))}
    </div>
  );
};

export default StatusActions;

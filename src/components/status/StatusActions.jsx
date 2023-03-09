import React, {useState, useEffect} from 'react';
import {stringSort} from './../../helpers/misc';
//const core = require('./../../core');
//const output = require('./../../output');

let g = window;
const StatusActions = () => {
  const [actions, setActions] = useState(['test', 'test2']);

  useEffect(() => {
    let interval = setInterval(() => {
      const actionValues = Object.values(g.c.actions);
      actionValues.sort(function (a, b) {
        if (a.key < b.key) {
          return -1;
        }
        if (a.key > b.key) {
          return 1;
        }
        return 0;
      });
      let t = 0;
      setActions(Object.values(actionValues));
    }, 500);
  }, []);

  const onClickAction = (sender) => {
    const action = sender.target.value;
    console.log(action);
    g.core.isStillAliveGameLoop(action, g.c.inventory, g.c.vitals, g.c.actions);
  };

  return (
    <div
      id='stats-actions'
      className='status'
    >
      <div id='stats-actions-header'>
        {actions.length} ACTIONS AVAILABLE FOR YOU TO TRY
      </div>
      {actions
        .filter((action) => action.key !== 'default')
        .map((action) => (
          <button
            key={action.key}
            type='button'
            className='m-1 p-1
             btn btn-secondary'
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

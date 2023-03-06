import React from 'react';
import TimeDayScoreContainer from './TimeDayScoreContainer';
import StatusVitals from './StatusVitals';
import StatusInventory from './StatusInventory';
import StatusActions from './StatusActions';

const StatusesContainer = (props) => {
  const groupClass = 'status';
  return (
    <div
      id='statuses-container'
      className={groupClass}
    >
      <TimeDayScoreContainer />
      <StatusVitals className={groupClass} />
      <StatusInventory className={groupClass} />
      <StatusActions className={groupClass} />
    </div>
  );
};

export default StatusesContainer;

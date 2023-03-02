import React from 'react';
import TimeDayScoreContainer from './TimeDayScoreContainer';
import StatusVitals from './StatusVitals';
import StatusInventory from './StatusInventory';
import StatusActions from './StatusActions';

const StatusesContainer = (props) => {
  return (
    <div id='statuses-container'>
      <TimeDayScoreContainer />
      <StatusVitals />
      <StatusInventory />
      <StatusActions />
    </div>
  );
};

export default StatusesContainer;

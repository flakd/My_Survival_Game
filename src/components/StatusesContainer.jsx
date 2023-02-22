import React from 'react';

const StatusesContainer = () => {
  return (
    <div id='statuses-container'>
      <div id='timeDayScore-container'>
        <div id='day'></div>
        <div id='time'></div>
        <div id='score'></div>
      </div>
      <div
        id='status-vitals'
        className='status'
      ></div>
      <div
        id='status-inventory'
        className='status'
      ></div>
      <div
        id='status-actions'
        className='status'
      ></div>
    </div>
  );
};

export default StatusesContainer;

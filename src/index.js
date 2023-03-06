import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import InputOutput from './components/InputOutput';
import LogsContainer from './components/LogsContainer';
import StatusesContainer from './components/status/StatusesContainer';
import Map from './components/Map';
import Player from './components/Player';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const map = ReactDOM.createRoot(document.getElementById('map'));
map.render(<Map />);

const player = ReactDOM.createRoot(document.getElementById('player'));
player.render(<Player />);

/* const statusesContainer = ReactDOM.createRoot(
  document.getElementById('statuses-container')
);
statusesContainer.render(<StatusesContainer />);

const inputOutput = ReactDOM.createRoot(
  document.getElementById('input-output')
);
inputOutput.render(<InputOutput />); */

const logsContainer = ReactDOM.createRoot(
  document.getElementById('logs-container')
);
logsContainer.render(<LogsContainer />);

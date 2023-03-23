import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LogsContainer from './components/LogsContainer';
import Map from './components/map/Map';
import Player from './components/map/Player';

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

const logsContainer = ReactDOM.createRoot(
  document.getElementById('logs-container')
);
logsContainer.render(<LogsContainer />);

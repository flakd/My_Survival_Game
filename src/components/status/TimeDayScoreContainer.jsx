import React from 'react';
import {useState, useEffect} from 'react';
import MusicOff from '../MusicOff';

let g = window;
const TimeDayScoreContainer = (props) => {
  const [day, setDay] = useState(0);
  const [timeHour, setTimeHour] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setDay(g.t.day);
      setTimeHour(g.t.hour);
      setScore(g.c.score);
    }, 500);
  }, []);

  return (
    <div
      id='timeDayScore-container'
      className={props.className}
    >
      <div id='day'>Day:{day.toString().padStart(3, '0')}</div>
      <div id='time'>Hour:{timeHour.toString().padStart(2, '0')}</div>
      <div id='score'>0 pts</div>
      <MusicOff />
    </div>
  );
};

export default TimeDayScoreContainer;

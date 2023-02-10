import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Timer = (props) => (
  <CountdownCircleTimer
    isPlaying
    duration={30}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[30, 20, 10, 0]}
    onComplete={props.onComplete} //타이머 끝나면 부결 올리고 종료
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

export default Timer;

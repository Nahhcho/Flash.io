import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const Timer = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-white font-sora text-[24px]">
        <Image src={'/clock.png'} width={40} height={40} alt='clock'/>
       <p>
            {formatTime(secondsElapsed)}
        </p>
    </div>
  );
};

export default Timer;
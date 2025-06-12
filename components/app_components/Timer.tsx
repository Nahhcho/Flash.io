import { formatTime } from '@/lib/utils/formatTime';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface Props {
  secondsElapsed: number;
  setSecondsElapsed: React.Dispatch<React.SetStateAction<number>>;
}

const Timer = ({ secondsElapsed, setSecondsElapsed }: Props) => {

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
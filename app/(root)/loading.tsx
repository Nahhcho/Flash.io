"use client";
import React from 'react'
import { motion } from 'framer-motion';

const dropIn = {
    hidden: {
        y: "50vh",
        opacity: 0
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.75,
            ease: "easeInOut",
            repeat: Infinity,
        }
    },
    exit: {
        y: "0",
        opacity: 0,
        transition: {
            duration: 0.75,
            ease: "easeOut"
        }
    }
}

const Loading = () => {

  return (
    <div className="col-span-12 flex justify-center items-center">
        <motion.img 
        src={"/bulbs/bulb-on.png"} 
        className='w-[350px] h-[350px]'
        alt='Loading...'
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        />
    </div>
  );
};

export default Loading;


import Image from 'next/image'
import React from 'react'

export const courses = [
    {
        title: "Biology 101",
        completed: true
    },
    {
        title: "Math 520",
        completed: true
    },
    {
        title: "Physics 220",
        completed: false    
    },
    {
        title: "Poly Sci 110",
        completed: false
    },

]

const days = ["S", "M", "T", "W", "Th", "F", "S"]

const Calendar = () => {

    const currentDay = new Date().getDay();

  return (
    <>
    <div className='col-start-4 col-end-13 grid grid-cols-7 pt-[45px] pb-[26px]'>
        {days.map((day, index) => (
            
            <div key={index} className={`place-self-center flex justify-center items-center h-[60px] w-[60px] font-sora text-[32px] font-semibold text-white
                 ${currentDay === index ? 'rounded-full bg-[#6366F1]' : ''}
                `}>{day[0]}</div>
        ))}
    </div>

    <div style={{
        height: `${courses.length * 115}px`,
        gridTemplateRows: `repeat(${courses.length}, 1fr)`
    }} className='col-start-2 col-end-4 grid text-right items-center pr-4'>
        {courses.map((course, index) => (
            <p key={index} className='font-sora font-semibold text-white text-[22px]'>{course.title}</p>
        ))}
    </div>

    <div style={{ 
        height: `${courses.length * 115}px`,
        gridTemplateRows: `repeat(${courses.length}, 1fr)`,
        gridTemplateColumns: `repeat(${days.length}, 1fr)`
        }} 
        className='col-start-4 col-end-13 shadow-[inset_0px_1px_15px_rgba(0,0,0,0.25)] h-[115px] rounded-[4px] grid bg-[#6366F1]'
        >
        {courses.map((course, rowIndex) => (
            days.map((day, colIndex) => (

                <div key={colIndex} style={{
                    ...(rowIndex !== 0 && {borderTop: "1px solid #7679EF"}),
                    ...(colIndex !== 0 && {borderLeft: "1px solid #7679EF"}),
                    ...(colIndex === 0 && {marginLeft: "9px"}),
                    ...(colIndex === 6 && {marginRight: "9px"}),
                    ...(rowIndex === 0 && {marginTop: "9px"}),
                    ...(rowIndex === (courses.length-1) && {marginBottom: "9px"})

                }} 
                > 
                <div className='flex justify-center items-center h-full'>
                    <div className='bg-[#557199] w-fit px-3 py-2 rounded-[30px] justify-center relative'>
                        {
                            currentDay === colIndex && (
                                <Image src={ course.completed ? '/checked.png' : '/unchecked.png'} width={22} height={22} alt='unchecked' className='absolute translate-x-14 -translate-y-4'/>
                            ) 
                        }
                        <p className='text-white text-[14px] font-sora'>25 terms</p>
                    </div> 
                </div>
                </div>
            ))
        ))}
    </div>
    </>
  )
}

export default Calendar
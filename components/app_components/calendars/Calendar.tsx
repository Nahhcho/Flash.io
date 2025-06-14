"use client";

import { ICourseDoc } from '@/database/course.model'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { IStudyPlanDoc } from '@/database/study-plan.model';
import { getSunSat, toLocalMidnight } from '@/lib/utils/dateLogic';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const days = ["S", "M", "T", "W", "Th", "F", "S"]

const Calendar = ({ courses, examSets, studyPlans }: { courses: ICourseDoc[], examSets: IFlashcardSetDoc[], studyPlans: IStudyPlanDoc[] }) => {
    const [sun, setSun] = useState<Date | null>(null);
    const [sat, setSat] = useState<Date | null>(null);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [animateLeft, setAnimateLeft] = useState(false)
    const [animateRight, setAnimateRight] = useState(false)
    const [animateDown, setAnimateDown] = useState(false);
    
    useEffect(() => {
      const { sunday, saturday } = getSunSat(viewDate);
      setSun(sunday);
      setSat(saturday);
    }, [viewDate])

    const handleRightClick = () => {
      setAnimateLeft(true);
      setViewDate(prev => {
        const nextWeek = new Date(prev);
        nextWeek.setDate(prev.getDate() + 7);
        return nextWeek;
      })
      setTimeout(() => {
        setAnimateLeft(false);
      }, 350)
    }

    const handleLeftClick = () => {
      setAnimateRight(true);
      setViewDate(prev => {
        const lastWeek = new Date(prev);
        lastWeek.setDate(prev.getDate() - 7);
        return lastWeek;
      })
      setTimeout(() => {
        setAnimateRight(false);
      }, 350)
    }

  return (
    <>
    <div className='col-start-4 col-end-13 overflow-x-hidden pt-[45px]'>
      <div className={`grid grid-cols-7 pt-[20px] pb-[26px] ${animateDown ? "motion-preset-slide-down motion-duration-350" : ""} ${animateRight ? "motion-preset-slide-right motion-duration-350": ""} ${animateLeft ? "motion-preset-slide-left motion-duration-350": ""}`}>
          {days.map((day, index) => (
          
            <div key={index} className={`place-self-center flex justify-center items-center h-[60px] w-[60px] font-sora text-[32px] font-semibold text-white
              ${viewDate.getDate() === new Date().getDate() && viewDate.getDay() === index ? 'rounded-full bg-[#6366F1]' : ''}
              `}>{day[0]}</div>
            ))}
      </div>
    </div>

<div
  className="col-start-2 col-end-4 grid 
             items-center        /* vertical-center all cells */
             justify-items-end  /* push content to the right */
             pr-4"
  style={{
    gridTemplateRows: `repeat(${courses.length}, minmax(115px, auto))`,
  }}
>
  {courses.map((course, idx) => (
    <div key={idx}>
      <p className="font-sora font-semibold text-white text-[22px]">
        {course.title}
      </p>
    </div>
  ))}
</div>

 <div
  className="col-start-4 col-end-13 grid shadow-[inset_0px_1px_15px_rgba(0,0,0,0.25)] bg-[#6366F1]"
  style={{
    // 1fr → minmax(115px, auto)
    gridTemplateRows: `repeat(${courses.length}, minmax(115px, auto))`,
    // just keep your 7 equal columns
    gridTemplateColumns: `repeat(${days.length}, 1fr)`
  }}
>
  {courses.map((course, rowIndex) =>
    days.map((day, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        style={{
          // your borders/margins…
          ...(rowIndex !== 0 && { borderTop: "1px solid #7679EF" }),
          ...(colIndex !== 0 && { borderLeft: "1px solid #7679EF" }),
          ...(colIndex === 0 && { marginLeft: "9px" }),
          ...(colIndex === 6 && { marginRight: "9px" }),
          ...(rowIndex === 0 && { marginTop: "9px" }),
          ...(rowIndex === courses.length - 1 && { marginBottom: "9px" }),
        }}
      >
        <div className="flex flex-col gap-2 justify-start items-center h-full p-2 overflow-visible">
          {examSets
            ?.filter(es => {
                if (!es.dueDate || !sun || !sat || course._id !== es.courseId) return false
                // make a new Date at local midnight for that same day:
                const dueUtc = new Date(es.dueDate);
                const dueLocalMidnight = toLocalMidnight(dueUtc);

                return (
                  dueLocalMidnight.getTime() >= sun.getTime() &&
                  dueLocalMidnight.getTime() <= sat.getTime() &&
                  dueLocalMidnight.getDay() === colIndex
                );
              })
            .map((es) => (
              <div
                key={es._id.toString()}
                className="bg-[#557199] w-fit px-8 py-2 rounded-full relative motion-preset-shrink motion-duration-350"
              >
                {
                    colIndex <= new Date().getDay() ? es.completed ? 
                    <Image src={'/checked.png'} width={22} height={22} alt='checked' className='absolute top-[-13px] right-[-6px]'/> :
                    <Image src={'/unchecked.png'} width={22} height={22} alt='unchecked' className='absolute top-[-6px] right-[-6px]'/> :
                    null
                }
                <p className="text-white text-[14px] font-sora">
                  {es.title}
                </p>
              </div>
            ))}
        </div>
      </div>
    ))
  )}
</div>
      <div className='flex items-center justify-center col-start-4 col-end-13 pt-3'>
          <div className='flex items-center gap-6'>
            <Image onClick={() => {if (!animateLeft && !animateRight && !animateDown) handleLeftClick()}} src={"/leftArrow.png"} width={60} height={60} quality={100} alt='leftArrow'/>
            <div className='flex flex-col items-center justify-center mt-8 gap-2 w-[140px]'>
              <span className='text-white font-sora text-2xl'>{`${viewDate.getMonth()+1}/${sun?.getDate()}-${viewDate.getMonth()+1}/${sat?.getDate()}`}</span>
              <Image onClick={() => {
                if (!animateDown && !animateLeft && !animateRight) {
                  setViewDate(new Date())
                  setAnimateDown(true);
                  setTimeout(() => {
                    setAnimateDown(false);
                  }, 350)
                }
                
                }} src={"/restart.png"} width={40} height={40} quality={100} alt='restart'/>
            </div>
            <Image onClick={() => {if (!animateLeft && !animateRight && !animateDown) handleRightClick()}} src={"/rightArrow.png"} width={60} height={60} quality={100} alt='rightArrow'/>
          </div>
      </div>
    </>
  )
}

export default Calendar
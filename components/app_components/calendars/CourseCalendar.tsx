"use client";

import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { IStudyPlanDoc } from '@/database/study-plan.model';
import { getSunSat, toLocalMidnight } from '@/lib/utils/dateLogic';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddModal from '../modals/AddModal';

const days = ["S", "M", "T", "W", "Th", "F", "S"]

const CourseCalendar = ({ studyPlans, examSets, courseId }: { studyPlans: IStudyPlanDoc[], examSets: IFlashcardSetDoc[], courseId: string }) => {
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
      console.log(examSets)
    }, [viewDate])

    const handleRightClick = () => {
      setAnimateLeft(true);
      setViewDate(prev => {
        const nextWeek = new Date(prev);
        nextWeek.setDate(prev.getDate() + 7);
        return nextWeek;
      });
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
    <div className='col-start-4 col-end-13 overflow-x-hidden'>
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
    gridTemplateRows: `repeat(${studyPlans.length}, minmax(115px, auto))`,
  }}
>
  {studyPlans.map((studyPlan, idx) => (
    <div key={idx}>
      <p className="font-sora font-semibold text-white text-[22px]">
        {studyPlan.title}
      </p>
    </div>
  ))}
</div>

 <div
  className="col-start-4 col-end-13 grid shadow-[inset_0px_1px_15px_rgba(0,0,0,0.25)] bg-[#6366F1]"
  style={{
    // 1fr → minmax(115px, auto)
    gridTemplateRows: `repeat(${studyPlans.length}, minmax(115px, auto))`,
    // just keep your 7 equal columns
    gridTemplateColumns: `repeat(${days.length}, 1fr)`
  }}
>
  {studyPlans.map((studyPlan, rowIndex) =>
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
          ...(rowIndex === studyPlans.length - 1 && { marginBottom: "9px" }),
        }}
      >
        <div className="flex flex-col gap-2 justify-start items-center h-full p-2 overflow-visible">
          {  sun && sat && new Date(studyPlan.examDate).getDay() === colIndex && new Date(studyPlan.examDate).getTime() >= sun.getTime() && new Date(studyPlan.examDate).getTime() <= sat.getTime() && 
              <div
                key={studyPlan._id.toString()}
                className="bg-[#557199] w-fit px-8 py-2 rounded-full relative motion-preset-shrink motion-duration-350"
              >
                <span className='bg-[#F59E0B] absolute font-sora text-white text-[14px] right-0 top-0 px-2 rounded-[10px] -translate-y-4 translate-x-3'>Exam Day!</span>
                <p className="text-white text-[14px] font-sora">
                  {studyPlan.title}
                </p>
              </div>
          }
          {examSets
            ?.filter(es => {
                            if (!es.dueDate || !sun || !sat || studyPlan._id !== es.studyPlanId) return false
                            // make a new Date at local midnight for that same day:
                            const dueLocalMidnight = new Date(es.dueDate);
            
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
                    <Image src={'/unchecked.png'} width={22} height={22} alt='checked' className='absolute top-[-6px] right-[-6px]'/> :
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
      <div className='flex items-center justify-between col-start-4 col-end-13 pt-2'>
        <div className='w-[33%]'>
          <AddModal formType='ADD_EXAM_SET' courseId={courseId} />
        </div>
          <div className='flex items-center gap-6'>
            <Image onClick={() => {if (!animateLeft && !animateRight && !animateDown) handleLeftClick()}} src={"/leftArrow.png"} width={60} height={60} quality={100} alt='leftArrow'/>
            <div className='flex flex-col items-center justify-center gap-2 w-[140px]'>
              <span className='text-white font-sora text-2xl pt-10'>{`${viewDate.getMonth()+1}/${sun?.getDate()}-${viewDate.getMonth()+1}/${sat?.getDate()}`}</span>
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

export default CourseCalendar
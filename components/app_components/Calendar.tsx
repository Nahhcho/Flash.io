
import { ICourseDoc } from '@/database/course.model'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { getWeeksExamSets } from '@/lib/actions/set.action'
import { getDay } from 'date-fns'
import Image from 'next/image'
import React from 'react'

const days = ["S", "M", "T", "W", "Th", "F", "S"]

const Calendar = async ({ courses }: { courses: ICourseDoc[] }) => {

    const currentDay = new Date().getDay();
    const res = await getWeeksExamSets();

    let examSets: IFlashcardSetDoc[] | null = null;
    if (res.data) {
        examSets = res.data;
    }
    console.log(examSets)

  return (
    <>
    <div className='col-start-4 col-end-13 grid grid-cols-7 pt-[45px] pb-[26px]'>
        {days.map((day, index) => (
            
            <div key={index} className={`place-self-center flex justify-center items-center h-[60px] w-[60px] font-sora text-[32px] font-semibold text-white
                 ${currentDay === index ? 'rounded-full bg-[#6366F1]' : ''}
                `}>{day[0]}</div>
        ))}
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
            ?.filter(
              (es) =>
                es.courseId.toString() === course._id.toString() &&
                es.currentSetCompletionDate?.getDay() === colIndex
            )
            .map((es) => (
              <div
                key={es._id.toString()}
                className="bg-[#557199] w-fit px-8 py-2 rounded-full relative"
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
    </>
  )
}

export default Calendar
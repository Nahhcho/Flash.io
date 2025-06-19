import { IStudyPlanDoc } from '@/database/study-plan.model'
import Link from 'next/link'
import React from 'react'

const StudyPlanCard = ({sp}: {sp: IStudyPlanDoc}) => {
    const daysTillExam = new Date(sp.examDate).getDate() - new Date().getDate();

  return (
    <Link href={`/studyPlanDetails/${sp._id.toString()}`}>
        <div className='flex flex-col relative px-[30px] justify-center items-center bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px]'>
            <span className='absolute right-0 bg-[#F59E0B] translate-x-2 text-white font-sora rounded-[10px] w-fit px-2 -translate-y-32'>{daysTillExam} day{daysTillExam > 1 ? "s": ""} left</span>
            <header className='font-sora font-semibold text-[20px] text-white'>{sp.title}</header>
        </div>
    </Link>
  )
}

export default StudyPlanCard
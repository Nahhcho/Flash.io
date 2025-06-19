import QuizResultsCard from '@/components/app_components/cards/QuizResultsCard';
import { IFlashcardSet, IFlashcardSetDoc } from '@/database/flashcard-set.model';
import { IFlashcardDoc } from '@/database/flashcard.model';
import { IStudyPlanDoc } from '@/database/study-plan.model';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils/dateLogic';
import Image from 'next/image';
import React from 'react'

const StudyPlanDetails = async ({ params }: { params: { id: string }}) => {
    const studyPlanId = params.id;
    let res = await api.studyPlans.get(studyPlanId);
    if (!res.success) return null;
    const studyPlan: IStudyPlanDoc = res.data as IStudyPlanDoc; 
    console.log("study plan: ", studyPlan);
    res = await api.studyPlans.getSets(studyPlanId);
    let sets: IFlashcardSetDoc[] = [];
    if (res.success) {
        sets = res.data as IFlashcardSetDoc[];
    }
    console.log("study plan sets: ", sets)

    function formatSecondsToTime(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} hrs`;
    }

    return (
    <>
        <div className='col-start-4 col-end-13'>
            <header className=' text-white text-[32px] font-sora font-semibold pb-[20px]'>{studyPlan.title}</header>
            <hr className=' w-full border-[#2E3D52] '/>
        </div>

        <div className='mt-[90px] shadow-[0px_0px_75px_rgba(0,0,0,0.25)] col-start-4 col-end-6 flex flex-col items-center justify-center bg-[#6366F1] rounded-[10px] px-[10px] py-2'>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Start Date</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{formatDate(new Date(studyPlan.startDate))}</span>
            </div>
            <hr className=' w-full border-[#9294F2]'/>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Quizzes Completed</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{studyPlan.completedQuizzes}</span>
            </div>
            <hr className=' w-full border-[#9294F2]'/>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Total Quiz Time</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{formatSecondsToTime(studyPlan.totalSeconds)}</span>
            </div>
        </div>

        <div className='flex flex-col shadow-[0px_0px_75px_rgba(0,0,0,0.25)] items-center justify-center mt-[60px] mb-[30px] col-start-6 col-end-9 bg-[#6366F1] mx-[20px] rounded-[10px] px-[10px] pb-6'>
            <Image src={'/studyPlanTrophy.png'} height={200} width={200} alt='trophy'/>
            <span className='text-white font-sora font-semibold text-[24px]'>You got this!</span>
        </div>
        
        <div className='mt-[90px] shadow-[0px_0px_75px_rgba(0,0,0,0.25)] col-start-9 col-end-11 flex flex-col items-center justify-center bg-[#6366F1] rounded-[10px] px-[10px] py-2'>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Exam Date</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{formatDate(new Date(studyPlan.examDate))}</span>
            </div>
            <hr className=' w-full border-[#9294F2]'/>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Average Quiz Grade</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{"B"}</span>
            </div>
            <hr className=' w-full border-[#9294F2]'/>
            <div className='flex flex-col py-2 gap-2 items-center'>
                <span className='font-sora text-white text-[18px]'>Total Quiz Time</span>
                <span className='font-sora text-white font-semibold text-[18px]'>{formatSecondsToTime(studyPlan.totalSeconds)}</span>
            </div>
        </div>

        <hr className='col-start-4 col-end-11 mt-[65px] w-full border-[#2E3D52] '/>

        <header className='col-start-4 col-end-11 flex justify-center items-center text-white font-sora font-semibold text-[28px] mt-6'>
            Your timeline
        </header>

        <div className='col-start-4 col-end-11 flex flex-col gap-20 mt-10'>
            {sets && sets.map((set) => (
                <QuizResultsCard set={set} />
            ))

            }
        </div>

    </>
  )
}

export default StudyPlanDetails
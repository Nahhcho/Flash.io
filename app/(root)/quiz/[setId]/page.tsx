"use client";

import ProgressBar from '@/components/app_components/ProgressBar'
import { IFlashcardSetDoc } from '@/database/flashcard-set.model';
import Flashcard, { IFlashcardDoc } from '@/database/flashcard.model';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const answers = ["Liver", "Mitochondra", "Reverse Osmosis", "Mitosis"]

const CourseQuiz = () => {
    const params = useParams();
    const setId = params.setId as string;
    const [set, setSet] = useState<IFlashcardSetDoc | undefined>();
    const [flashcards, setFlashcards] = useState<IFlashcardDoc[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.FlashcardSets.getSetAndFlashcards(setId);
            console.log(res)
            if (!res.success) return null;
        
            const { set, flashcards } = res.data as {
                set: IFlashcardSetDoc,
                flashcards: IFlashcardDoc[]
            };

            setSet(set);
            setFlashcards(flashcards);
        }

        fetchData();
    }, [setId])
    
    return (
    <div className='col-start-4 col-end-13 h-screen'>
        <header className='col-start-4 col-end-13 text-white text-[32px] font-sora font-semibold pb-[25px]'>{set?.title}</header>
        
        <hr className=' w-full border-[#2E3D52] col-start-4 col-end-13'/>
        
        <div className='col-start-4 col-end-13 flex items-center justify-center gap-[60px] pt-[60px]'>
            <span className='text-white font-sora text-[26px] font-semibold'>Question {index+1}</span>
            <div className='flex-1 flex items-center justify-center'>
                <ProgressBar />
            </div>
        </div>

        {/*Question goes into this div*/}

        <div className='col-start-4 col-end-13 flex justify-center items-center rounded-[10px] bg-[#6366F1] py-[60px] mt-[50px]'>
            <span className='font-sora font-semibold text-[32px] text-white'>{flashcards.length > 0 && flashcards[index].question}</span>
        </div>
        
        <div className='col-start-4 col-end-13 grid grid-cols-2 gap-x-[80px] pt-[40px] gap-[40px]'>
            {/* {flashcards && answers.map((answer, index) => (
                <div onClick={() => setIndex((prev) => prev + 1)} key={index} className='font-sora text-[32px] text-white cursor-pointer bg-[#3D516D] hover:bg-[#4F6B92] flex justify-center items-center py-[60px] rounded-[10px]'>
                    {answer}
                </div>
            ))} */}

            {flashcards.length > 0 && 
                <div onClick={() => setIndex((prev) => prev + 1)} key={index} className='font-sora text-[32px] text-white cursor-pointer bg-[#3D516D] hover:bg-[#4F6B92] flex justify-center items-center py-[60px] rounded-[10px]'>
                    {flashcards[index].answer}
                </div>
            }
        </div>
        
    </div>
  )
}

export default CourseQuiz
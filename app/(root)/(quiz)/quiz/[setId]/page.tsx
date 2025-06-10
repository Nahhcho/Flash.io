"use client";

import CloseModal from '@/components/app_components/modals/CloseModal';
import ProgressBar from '@/components/app_components/ProgressBar'
import Timer from '@/components/app_components/Timer';
import { IFlashcardSetDoc } from '@/database/flashcard-set.model';
import { IFlashcardDoc } from '@/database/flashcard.model';
import { api } from '@/lib/api';
import { getRandomUniqueNumbers } from '@/lib/utils/random';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loading from '../../loading';
import { cn } from '@/lib/utils';

const answerLetters = ['A) ', 'B) ', 'C) ', 'D) ']

const CourseQuiz = () => {
    const [set, setSet] = useState<IFlashcardSetDoc | undefined>();
    const [flashcards, setFlashcards] = useState<IFlashcardDoc[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [wrongCount, setWrongCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);
    const router = useRouter();
    const params = useParams();
    const setId = params.setId as string;

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

    useEffect(() => {
        if (flashcards.length === 0 || index === flashcards.length) return;
        const randomNums = getRandomUniqueNumbers(4, 0, flashcards.length-1, index);
        const answers: string[] = []
        randomNums.forEach(num => {
            answers.push(flashcards[num].answer);
        })

        setAnswers(answers);
        setLoading(false);

    }, [flashcards, index])

    if (loading) return <Loading />;

    if (!loading && index === flashcards.length) {
        router.push("/");
        //router.push(`/quiz/${setId}/results`);
        return null; 
    }
    
    return (
    <>
        {//<audio src="/audio/locked-in.mp3" autoPlay loop />
        }
        <div className='col-start-1 col-end-3'>
            <Timer />
        </div>
        <header className='flex items-center justify-center col-start-3 col-end-11 text-white text-[32px] font-sora font-semibold pb-[10px]'>{set?.title}</header>
        <div onClick={() => {setIsOpen(true)}} className='col-start-12 col-end-13 flex items-center justify-center gap-2 rounded-[10px] border-2 border-[#A78BFA] cursor-pointer hover:border-[#b8a3f8] hover:font-semibold'>
            <p className='font-sora text-white text-[24px]'>Quit</p> 
        </div>
        {
            isOpen &&  
            <CloseModal setIsOpen={setIsOpen}/>
        }
        
        <hr className=' w-full border-[#2E3D52] col-start-3 col-end-11'/>

        
        <div className='grid grid-cols-12 col-span-12'>
            <div className='col-start-2 flex flex-col items-center justify-center pt-[25px] pr-[10px]'>
                <Image src={"/bulbs/bulb-off.png"} width={104} height={104} alt='wrong'/>
                <p className='text-white font-sora text-[32px]'>{wrongCount}</p>
            </div>

            <div className='col-start-3 col-end-11 flex justify-center items-center rounded-[10px] bg-[#6366F1] h-[150px] px-[60px] mt-[20px]'>
                <span className='font-sora font-semibold text-[24px] text-white'>{flashcards.length > 0 && flashcards[index]?.question}</span>
            </div>

            <div className='col-start-11 flex flex-col items-center justify-center pt-[25px] pl-[10px]'>
                <Image src={"/favicon.png"} width={64} height={64} alt='wrong'/>
                <p className='text-white font-sora text-[32px]'>{rightCount}</p>
            </div>
        </div>

        <div className='col-start-3 col-end-11 flex items-center justify-center gap-[60px] pt-[30px]'>
            <span className='text-white font-sora text-[26px] font-semibold w-[240px]'>Question {index+1} / {flashcards.length}</span>
            <div className='flex-1 flex items-center justify-center'>
                <ProgressBar progress={Math.floor((100/flashcards.length)*(rightCount))}/>
            </div>
        </div>

        
        <div className='col-start-2 col-end-12 grid grid-cols-2 gap-x-[40px] mt-[30px] py-[40px] gap-[40px] bg-[#6366F1] rounded-[10px] px-[140px] shadow-[inset_0px_1px_15px_rgba(0,0,0,0.25)]'>

            {answers.length > 0 &&
                answers.map((answer, i) => (
                <div onClick={() => {
                    if (animate) return;
                    const isCorrect = answer === flashcards[index]?.answer;

                    setClickedIndex(i);
                    setAnimate(true);

                    setTimeout(() => {
                        
                        if (isCorrect) {
                            setRightCount((prev) => prev + 1);
                        } else {
                            setWrongCount((prev) => prev + 1);
                        }
                        
                        setAnimate(false);
                        setClickedIndex(null);
                        setIndex((prev) => prev + 1);
                    }, 700)
                }
                } key={i} className={cn(
                    "font-sora text-[20px] px-[30px] text-white cursor-pointer bg-[#3D516D] hover:bg-[#4F6B92] flex justify-center items-center h-[180px] rounded-[10px]",
                    animate && i == clickedIndex && [answer === flashcards[index].answer ? "motion-preset-expand bg-green-500 hover:bg-green-500" : "motion-preset-shake bg-red-500 hover:bg-red-500"]
                )}>
                    {`${answerLetters[i]} ${answer}`}
                    {i == clickedIndex && answer === flashcards[index].answer && <audio src={'/audio/right.wav'} autoPlay/>}
                </div>
                ))
            }
            
        </div>
    </>
  )
}

export default CourseQuiz
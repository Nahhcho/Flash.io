"use client"

import { IFlashcardSetDoc } from '@/database/flashcard-set.model'
import { formatDate } from '@/lib/utils/dateLogic'
import Image from 'next/image'
import React, { useState } from 'react'
import StartModal from '../modals/StartModal'

const QuizResultsCard = ({set}: {set: IFlashcardSetDoc}) => {
    const [isOpen, setIsOpen] = useState(false);

    let src = ""

    if (!set.completed) {
        src = "/noGrade.png"
    } else {
        const percentage = set.percentage!;
        if (percentage >= 90) {
            src = "/grades/brushA.png";
          } else if (percentage >= 80) {
            src = "/grades/brushB.png";
          } else if (percentage >= 70) {
            src = "/grades/brushC.png";   
          } else if (percentage >= 60) {
            src = "/grades/brushD.png";
          } else {
            src = "/grades/brushF.png";
          }
    }

  return (
    <div className='w-full relative bg-[#6366F1] rounded-[10px] flex py-[25px] px-[20px]'>
        <div className='bg-[#3D516D] rounded-[10px] absolute right-0 top-0 -translate-y-7 translate-x-2 text-white font-sora px-4 py-2 text-[18px] font-medium'>{formatDate(new Date(set.dueDate!))}</div>
        <div className='flex flex-col justify-center items-center rounded-[10px] bg-[#3D516D] px-6 pt-4 w-[40%]'>
            <span className='font-sora text-white font-semibold text-[20px]'>{set.title}</span>
            <Image className='-rotate-10 mt-2' src={src} width={set.completed ? 200 : 240} height={set.completed ? 200 : 240} quality={100} alt='no grade'/>
        </div>
        <div className='flex items-center justify-center w-[10%]'>
            <div className='border-l h-full border-[#9294F2]'></div>
        </div>
        {set.completed ? (
            <div className="grid grid-cols-6 bg-[#3D516D] rounded-[10px] w-[50%]">
              
            {/* Total Time */}
            <span className="col-start-1 col-end-4 py-4 text-right text-white font-sora text-[20px]">
              Total Time:
            </span>
            <span className="col-start-4 col-end-7 pl-5 py-4 text-left text-white font-sora font-extralight text-[20px]">
              {set.totalSeconds} m
            </span>
            <hr className="border-1 border-[#516D94] col-span-6 mx-2" />
          
            {/* Right Answers */}
            <span className="col-start-1 col-end-4 py-4 text-right text-white font-sora text-[20px]">
              Right Answers:
            </span>
            <span className="col-start-4 col-end-7 pl-5 py-4 text-left text-white font-sora font-extralight text-[20px]">
              {set.rightCount}
            </span>
            <hr className="border-1 border-[#516D94] col-span-6 mx-2" />
          
            {/* Wrong Answers */}
            <span className="col-start-1 col-end-4 py-4 text-right text-white font-sora text-[20px]">
              Wrong Answers:
            </span>
            <span className="col-start-4 col-end-7 pl-5 py-4 text-left text-white font-sora font-extralight text-[20px]">
              {set.wrongCount}
            </span>
            <hr className="border-1 border-[#516D94] col-span-6 mx-2" />
          
            {/* Percentage */}
            <span className="col-start-1 col-end-4 py-4 text-right text-white font-sora text-[20px]">
              Percentage:
            </span>
            <span className="col-start-4 col-end-7 pl-5 py-4 text-left text-white font-sora font-extralight text-[20px]">
              {set.percentage}%
            </span>
          </div>
          
        ) : new Date(set.dueDate!).getDate() - new Date().getDate() <= 0 ? (
            <div className='flex flex-col justify-center items-center rounded-[10px] bg-[#3D516D] px-6 pt-4 w-[50%]'>
                <Image className='pb-6' src={"/favicon.png"} width={90} height={90} quality={100} alt='no grade'/>
                <div onClick={() => setIsOpen(true)} className="flex justify-center w-[200px] gap-2 rounded-[10px] bg-[#6366F1] cursor-pointer hover:bg-[#898BF4]">
                    <p className="font-sora text-white text-[24px] py-1">Start Quiz</p>
                </div>
            </div> 
        ) : (
            <div className='flex flex-col justify-center items-center rounded-[10px] bg-[#3D516D] px-6 pt-4 w-[50%]'>
                <Image className='pb-6' src={"/favicon.png"} width={90} height={90} quality={100} alt='no grade'/>
                <span className='font-sora text-white text-[20px] text-center'>Quiz will be available in {new Date(set.dueDate!).getDate() - new Date().getDate()} day{new Date(set.dueDate!).getDate() - new Date().getDate() > 1 ? "s" : ""}</span>
            </div> 
        )
        }
        {isOpen &&
            <StartModal set={set} isOpen={isOpen} setIsOpen={setIsOpen}/>
        }
    </div>
  )
}

export default QuizResultsCard
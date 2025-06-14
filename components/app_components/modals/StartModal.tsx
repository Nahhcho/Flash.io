import { IFlashcardSetDoc } from '@/database/flashcard-set.model';
import { formatDate, toLocalMidnight } from '@/lib/utils/dateLogic';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState } from 'react'

const StartModal = ({set, isOpen, setIsOpen}: {set:IFlashcardSetDoc, isOpen:boolean, setIsOpen:Dispatch<SetStateAction<boolean>>}) => {
    const router = useRouter();
    const [starting, setStarting] = useState(false)

    const secondaryButtonText = set.type === "Exam" ? "Study" : "Back"
    const today = new Date().getTime();
    
    let msg = ""
    if (set.type === "Exam" && set.dueDate) {
        const quizDate = toLocalMidnight(new Date(set.dueDate)).getTime();
        
        if (quizDate <= today && !set.completed) {
            msg = "Do well—your next quiz is based on this one."
        }
        else if (quizDate > today) {
            msg = `This quiz isn't available until ${formatDate(toLocalMidnight(new Date(set.dueDate)))}`
        }
    }

    if (!msg) {
        msg = "Start Quiz?"
    }

  return (
    <>
    {isOpen &&
    <div className='fixed inset-0 bg-black/50 flex flex-col items-center pt-[20px] z-50 w-screen' onClick={() => {setIsOpen(false)}}>
        <div onClick={(e) => {e.stopPropagation()}} className='flex flex-col items-center justify-center px-[100px] bg-[#243040] rounded-[10px] py-[35px] motion-preset-slide-down motion-duration-300'>
            <p className='text-white font-sora text-[28px]'>{ msg }</p>
                {(set.dueDate && !(toLocalMidnight(new Date(set.dueDate)).getTime() > today)) ?
                (<div className='flex gap-4 mt-[30px]'>
                <button disabled={starting} onClick={() => {setStarting(true); router.push(`/quiz/${set._id.toString()}`)}} className='col-start-12 col-end-13 flex items-center justify-center w-[200px] gap-2 rounded-[10px] bg-[#6366F1] cursor-pointer hover:bg-[#898BF4]'>
                    <p className='font-sora text-white text-[24px] py-1'>{starting ? "Starting..." : "Start"}</p> 
                </button>
                    <div onClick={() => {setIsOpen(false)}} className='col-start-12 col-end-13 flex items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#6366F1] cursor-pointer hover:border-[#898BF4]'>
                        <p className='font-sora text-white text-[24px] py-1'>{ secondaryButtonText }</p> 
                    </div>
                </div>) : (
                    <>
                    <span className="flex flex-col pt-2 items-center justify-center font-sora text-[#425775] text-[20px]">
                           <p>
                                Remeber that conistency beats cramming. 
                            </p>
                            <p>
                                Study previous quizzes if you want the extra practice!
                            </p> 
                    </span>
                    <div onClick={() => {setIsOpen(false)}} className='mt-[20px] col-start-12 col-end-13 flex items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#6366F1] cursor-pointer hover:border-[#898BF4]'>
                        <p className='font-sora text-white text-[24px] py-1'> Close </p> 
                    </div>
                    </>
                )
                }
        </div>
    </div>
    }
    </>
  )
}

export default StartModal
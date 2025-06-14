"use client";

import { ROUTES } from '@/constants/routes';
import {  IFlashcardSetDoc } from '@/database/flashcard-set.model';
import Image from 'next/image';
import React, { useState } from 'react'
import StartModal from '../modals/StartModal';
import { usePathname, useRouter } from 'next/navigation';
import { toLocalMidnight } from '@/lib/utils/dateLogic';

interface Props {
    set: IFlashcardSetDoc;
}

const SetCard = ( { set } : Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname()
  const router = useRouter();
  const overdue = (set.dueDate && !set.completed && toLocalMidnight(new Date(set.dueDate)).getTime() < new Date().getTime());
  const daysOverDue = overdue ? new Date().getDay() - toLocalMidnight(new Date(set.dueDate!)).getDay() : 0

  return (
    <>
    <div onClick={() => {setIsOpen(true)}} className='bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px] relative flex flex-col'>
        {
            set.completed && <Image src={'/checked.png'} width={22} height={22} alt='checked' className='absolute right-0 -translate-y-3 translate-x-2'/>
        }
        {
          overdue && daysOverDue > 0 && <span className='absolute right-0 bg-[#F59E0B] translate-x-2 text-white font-sora rounded-[10px] w-fit px-2 -translate-y-5'>overdue {daysOverDue} day{daysOverDue > 1 ? "s":""}</span>
        }
        {path !== "/" &&
          <div className='flex justify-end pr-2 pt-2'>
            <Image onClick={(e) => {e.stopPropagation(); router.push(ROUTES.SET_EDIT(set._id.toString(), set.courseId.toString()))}} src={"/settings.png"} width={40} height={30} alt='settings' className='hover:motion-preset-spin motion-duration-2000'/>     
          </div>
        }
        <header className='flex px-[30px] justify-center pt-[25px] font-sora font-semibold text-[20px] text-white'>{set.title}</header>
        <div className='flex justify-center p-[50px]'>
            <div className='bg-[#557199] w-fit px-3 py-2 rounded-[30px]'><p className='text-white text-[14px] font-sora'>{set.terms} terms</p></div> 
        </div>
    </div>
      {isOpen &&
        <StartModal set={set} isOpen={isOpen} setIsOpen={setIsOpen} />
      }
    </>
  )
}

export default SetCard;
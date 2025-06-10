import { ROUTES } from '@/constants/routes';
import {  IFlashcardSetDoc } from '@/database/flashcard-set.model';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    set: IFlashcardSetDoc;
}

const SetCard = ( { set } : Props) => {

  return (
    <Link href={`/quiz/${set._id}`}>
    <div className='bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px] relative flex flex-col'>
        {
            //quiz.completed && <Image src={'/checked.png'} width={22} height={22} alt='checked' className='absolute right-0 -translate-y-3 translate-x-2'/>
        }
        <Link href={ROUTES.SET_EDIT(set._id.toString(), set.courseId.toString())} className='flex justify-end px-2 pt-1'>
          <Image src={"/settings.png"} width={40} height={30} alt='settings' className='hover:motion-preset-spin motion-duration-2000'/>
        </Link>
        <header className='flex px-[30px] justify-center pt-[25px] font-sora font-semibold text-[20px] text-white'>{set.title}</header>
        <div className='flex justify-center p-[50px]'>
            <div className='bg-[#557199] w-fit px-3 py-2 rounded-[30px]'><p className='text-white text-[14px] font-sora'>{set.terms} terms</p></div> 
        </div>
    </div>
    </Link>

  )
}

export default SetCard;
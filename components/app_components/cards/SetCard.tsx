import { IFlashcardSet, IFlashcardSetDoc } from '@/database/flashcard-set.model';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
    set: IFlashcardSetDoc;
}

const SetCard = ( { set } : Props) => {

  return (
    <Link href={'/courseDetails/1/quiz/1'}>
    <div className='bg-[#3D516D] hover:bg-[#4F6B92] cursor-pointer rounded-[10px] h-[250px] relative flex flex-col'>
        {
            //quiz.completed && <Image src={'/checked.png'} width={22} height={22} alt='checked' className='absolute right-0 -translate-y-3 translate-x-2'/>
        }
        <header className='flex justify-center pt-[25px] font-sora font-semibold text-[20px] text-white'>{set.title}</header>
        <div className='flex justify-center p-[50px]'>
            <div className='bg-[#557199] w-fit px-3 py-2 rounded-[30px]'><p className='text-white text-[14px] font-sora'>{set.terms} terms</p></div> 
        </div>
    </div>
    </Link>

  )
}

export default SetCard;
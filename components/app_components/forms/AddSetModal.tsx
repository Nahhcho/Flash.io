"use client";

import Image from 'next/image';
import React, { useState } from 'react'
import CreateForm from './CreateForm';

const AddSetModal = () => {
    
    const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    { isOpen &&
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen' onClick={() => {setIsOpen(false)}}>
        <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px]'>
            <p className='font-sora text-white text-[28px] pb-[10px]'>Set Name</p>
            <input type="text" className='mb-[20px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
            <p className='pb-[10px] font-sora text-white text-[28px]'>Set Materials</p>
            <div className='cursor-pointer bg-[#3D516D] mb-[30px] flex justify-center items-center py-[28px] rounded-[10px]'>
                <div className='flex gap-[25px]'>
                    <Image src={'/file.png'} width={36} height={47} alt='file'/>
                    <p className='text-white font-sora text-[28px]'>Drop all files</p>
                </div>
            </div>
            <div className='flex justify-center text-white font-sora font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                Create Set
            </div>
        </div>
    </div>
    }
    <div onClick={() => {setIsOpen(true)}} className='font-semibold  font-sora text-white text-[24px] cursor-pointer hover:bg-[#898BF4] bg-[#6366F1] w-[285px] py-[15px] rounded-[10px] flex justify-center'>
      Add a Set
    </div>

    </>
  )
}

export default AddSetModal
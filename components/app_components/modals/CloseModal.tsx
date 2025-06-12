"use client";
import { useRouter } from 'next/navigation';
import React from 'react'

const CloseModal = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const router = useRouter()

  return (
    <div className='fixed inset-0 bg-black/50 flex flex-col items-center pt-[20px] z-50 w-screen' onClick={() => {setIsOpen(false)}}>
        <div onClick={(e) => {e.stopPropagation()}} className='flex flex-col items-center justify-center px-[100px] bg-[#243040] rounded-[10px] py-[35px] motion-preset-slide-down motion-duration-300'>
            <p className='text-white font-sora text-[28px] pb-[30px]'>Are you sure you want to quit?</p>
            <div className='flex gap-4'>
                <div onClick={() => {setIsOpen(false)}} className='col-start-12 col-end-13 flex items-center justify-center w-[200px] gap-2 rounded-[10px] bg-[#6366F1] cursor-pointer hover:bg-[#898BF4]'>
                    <p className='font-sora text-white text-[24px] py-1'>Continue</p> 
                </div>
                    <div onClick={() => {router.back()}} className='col-start-12 col-end-13 flex items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#6366F1] cursor-pointer hover:border-[#898BF4]'>
                        <p className='font-sora text-white text-[24px] py-1'>Quit</p> 
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CloseModal
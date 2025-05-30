"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import SelectableSet from '../SelectableSet';

const sets = [ "set 1", "set 2", "set 3", "set 4", "set 5", "set 6", "set 7", "set 8", "set 9"]

const AddExamModal = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedSetIds, setSelectedSetIds] = useState<string[]>([]);
    const toggleSelect = (id: string) => {
        setSelectedSetIds((prev) => prev.includes(id) ? prev.filter((curId) => curId !== id) : [...prev, id])
        console.log(selectedSetIds)
    }

    useEffect(() => {
        setSelectedSetIds([]);
        console.log(selectedSetIds)
    }, [isOpen]);

  return (
    <>
        { isOpen &&
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen' onClick={() => {setIsOpen(false)}}>
            <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px]'>
                <p className='font-sora text-white text-[28px] pb-[10px]'>Exam Name</p>
                <input type="text" className='mb-[20px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
                <p className='pb-[10px] font-sora text-white text-[28px]'>Related Course Materials</p>
                <div className='cursor-pointer bg-[#3D516D] mb-[20px] flex justify-center items-center py-[28px] rounded-[10px]'>
                    <div className='flex gap-[25px]'>
                        <Image src={'/file.png'} width={36} height={47} alt='file'/>
                        <p className='text-white font-sora text-[28px]'>Drop all files</p>
                    </div>
                </div>
                <p className='font-sora text-white text-[28px]'>Choose Related Set</p>
                <div className='flex flex-wrap gap-y-[16px] gap-x-[10px] py-[20px]'>
                    {
                        sets.map((set, index) => (

                            <SelectableSet setName={set} toggleSelect={toggleSelect}/>
                        ))
                    }
                </div>
                <div onClick={() => {setIsOpen(false)}} className='flex cursor-pointer justify-center text-white font-sora font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                    Create Exam
                </div>
            </div>
        </div>
        }
        <div onClick={() => {setIsOpen(true)}} className='font-semibold  font-sora text-white text-[24px] cursor-pointer hover:bg-[#898BF4] bg-[#6366F1] w-[285px] py-[15px] rounded-[10px] flex justify-center'>
          Add an Exam
        </div>
    </>
  )
}

export default AddExamModal
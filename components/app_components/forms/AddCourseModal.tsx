"use client";

import Image from 'next/image'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CreateForm from "./CreateForm"
import { AddCourseSchema } from "@/lib/validations"

const AddCourseModal = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const createCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:8000/courses/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });

        const data = await response.json();
        console.log(data);
    }

    useEffect(()=>{
        console.log(title)
    }, [title])

  return (
    <>
    { isOpen &&
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 w-screen' onClick={() => {setIsOpen(false)}}>
        <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px]'>
            <p className='font-sora text-white text-[28px] pb-[10px]'>Course Name</p>
            <input onChange={(e) => handleTitleChange(e)} type="text" className='mb-[20px] h-[54px] bg-[#3D516D] rounded-[10px] w-full text-white font-sora px-[16px] focus:outline-none' placeholder='title'/>
            <p className='pb-[10px] font-sora text-white text-[28px]'>Course Materials (optional)</p>
            <div className='bg-[#3D516D] mb-[30px] flex justify-center items-center py-[28px] rounded-[10px] cursor-pointer'>
                <div className='flex gap-[25px]'>
                    <Image src={'/file.png'} width={36} height={47} alt='file'/>
                    <p className='text-white font-sora text-[28px]'>Drop all files</p>
                </div>
            </div>
            <div onClick={(e) => createCourse(e)} className='flex justify-center cursor-pointer text-white font-sora font-semibold text-[24px] rounded-[10px] bg-[#6366F1] hover:bg-[#898BF4] w-[48%] py-[19px] '>
                Create Course
            </div>
        </div>
    </div>
}
    <button onClick={() => setIsOpen(true)} className='col-start-4 col-end-7 flex w-[97%] justify-center mt-[40px] bg-[#6366F1] hover:bg-[#898BF4] py-[17px] rounded-[10px]'><span className='text-white text-[24px] font-sora font-semibold'>Add Course</span></button>
    
    
    </>
  )
}

export default AddCourseModal
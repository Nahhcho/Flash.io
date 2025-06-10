"use client";
import { deleteCourse } from '@/lib/actions/course.action';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DeleteModal = ({ courseId }: { courseId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const res = await deleteCourse(courseId);
            console.log("DELETE COURSE RES: ", res)
            if (res.success) {
                router.push("/");
            }
        } catch (error) {
            console.error('Error deleting course: ', error);
        }
    }

  return (
    <> 
    { isOpen && 
        <div className='fixed inset-0 bg-black/50 flex flex-col items-center pt-[20px] z-50 w-screen' onClick={() => {setIsOpen(false)}}>
            <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px] motion-preset-slide-down motion-duration-300'>
                <p className='text-white font-sora text-[28px] pb-[30px]'>Are you sure you want to delete this course?</p>
                <div className='flex gap-4'>
                    <div onClick={handleDelete} className='col-start-12 col-end-13 flex items-center justify-center w-[200px] gap-2 rounded-[10px] bg-[#A78BFA] cursor-pointer hover:bg-[#b8a3f8]'>
                        <p className='font-sora text-white text-[24px] py-1'>Delete</p> 
                    </div>
                        <div onClick={() => {setIsOpen(false)}} className='col-start-12 col-end-13 flex items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#A78BFA] cursor-pointer hover:border-[#b8a3f8]'>
                            <p className='font-sora text-white text-[24px] py-1'>Close</p> 
                        </div>
                    </div>
            </div>
        </div>
    }
        <Image onClick={() => {setIsOpen(true)}} className='cursor-pointer' src={"/trash.png"} width={40} height={40} quality={100} alt='settings' />
    </>
  )
}

export default DeleteModal
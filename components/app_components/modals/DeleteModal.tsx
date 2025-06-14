"use client";
import { deleteCourse } from '@/lib/actions/course.action';
import { DeleteSet } from '@/lib/actions/set.action';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DeleteModal = ({ courseId, setId }: { courseId?: string, setId?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const resource = courseId ? "course" : "set"
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (courseId) {
                const res = await deleteCourse(courseId);
                console.log("DELETE COURSE RES: ", res)
                if (res.success) {
                    router.push("/");
                    setIsDeleting(false);
                }
            }
            else if (setId) {
                await DeleteSet(setId);
            }
        } catch (error) {
            console.error('Error deleting course/set: ', error);
        }
    }

  return (
    <> 
    { isOpen && 
        <div className='fixed inset-0 bg-black/50 flex flex-col items-center pt-[20px] z-50 w-screen' onClick={() => {setIsOpen(false)}}>
            <div onClick={(e) => {e.stopPropagation()}} className='flex-col w-[791px] bg-[#1F2937] rounded-[10px] px-[100px] py-[35px] motion-preset-slide-down motion-duration-300'>
                <p className='text-white font-sora text-[28px] pb-[30px]'>Are you sure you want to delete this {resource}?</p>
                <div className='flex gap-4'>
                <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className={cn(
                    'col-start-12 col-end-13 flex items-center justify-center w-[200px] gap-2 rounded-[10px] bg-[#6366F1] text-white text-[24px] py-1 font-sora',
                    isDeleting
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:bg-[#898BF4]'
                )}
                >
                {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                        <div onClick={() => {setIsOpen(false)}} className='col-start-12 col-end-13 flex items-center justify-center gap-2 w-[200px] rounded-[10px] border-2 border-[#6366F1] cursor-pointer hover:border-[#898BF4]'>
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
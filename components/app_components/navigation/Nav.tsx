"use client";

import { ICourseDoc } from '@/database/course.model';
import { api } from '@/lib/api';
import { ActionResponse } from '@/types/global';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Nav = () => {
    const [courses, setCourses] = useState<ICourseDoc[] | null>(null);
    const pathname = usePathname();
    const session = useSession();

    useEffect(() => {
        const fetch = async () => {
            if (!session || !session.data) {
                console.log("Error getting session");
                return null
            }

            const userId  = session!.data!.user!.id!;
            const res = (await api.courses.getAll(userId)) as ActionResponse;
            
            if (!res.success) {
                console.log("Error while fetching courses", res);
                return null;
            }

            const courses = res!.data! as ICourseDoc[]

            setCourses(courses);
        }

        fetch();
    }, [session])


  return (
    <div className='w-[226px] bg-[#A78BFA] h-screen pl-[25px] pt-[40px] fixed top-0 left-0'>
        
        <div onClick={() => {
            signOut({ redirectTo: "/about"})
        }} className='flex items-center gap-1'>
        <Image src={"/favicon.png"} height={35} width={35} quality={100} alt='icon'/>
        <p className='font-semibold text-[28px] flex'>Nuero <p className='text-[#6F00FF]'>Note</p></p>
        </div>
        
        <ul className='space-y-5 pt-6'>
            <li >
                <Link href={`/`} className='flex items-center gap-1'>
                    <Image src={'/home.png'} width={26} height={26} alt='home' />
                    <p className={`text-[22px] font-sora ${pathname === "/" ? "text-[#3308B2]" : "text-[#7244FB]"}  font-medium`}>Home</p>
                </Link>
            </li>
    

            <li className='flex items-center gap-1'>
                <Image src={"/book.png"} width={26} height={26} alt='book'/>
                <p className='text-[22px] font-sora text-[#7244FB] font-medium'>Courses</p>
            </li>

            <hr className='border-[#BCA7FB]' />

            {
                courses && courses.map((course: ICourseDoc, index) => (
                    
                        <li key={index}>
                            <Link href={`/courseDetails/${course._id}`}>
                            <p className={`text-[22px] font-sora ${pathname === `/courseDetails/${course._id}` ? "text-[#3308B2]" : "text-[#7244FB]"} font-medium`}>{course.title}</p>
                            </Link>
                        </li>
                ))
            }
            
        </ul>
    </div>
  )
}

export default Nav
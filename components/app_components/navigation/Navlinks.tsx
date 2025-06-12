"use client";

import { ICourseDoc } from '@/database/course.model'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Navlinks = ({ courses }: { courses: ICourseDoc[] | null }) => {
    const pathname = usePathname();

  return (
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
      
        {courses && courses.map((course: ICourseDoc) => (
            <li key={course._id.toString()}>
                <Link href={`/courseDetails/${course._id}`}>
                    <span className={`text-[22px] font-sora ${pathname.includes(`/courseDetails/${course._id}`) ? "text-[#3308B2]" : "text-[#7244FB]"} font-medium`}>{course.title}</span>
                </Link>
            </li>
          ))
        }
    </ul>
  )
}

export default Navlinks
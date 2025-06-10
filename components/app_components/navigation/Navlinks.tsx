"use client";

import { ICourseDoc } from '@/database/course.model'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Navlinks = ({ courses }: { courses: ICourseDoc[]}) => {
    const pathname = usePathname();

  return (
    <ul className='space-y-5 pt-6'>
    {courses.map((course: ICourseDoc, i) => (
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
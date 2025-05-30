"use client";

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
export const courses = [
    "Biology",
    "Calculus",
    "Physics",
    "Anatomy",
    "Poly Sci"
]

const Nav = () => {

    const pathname = usePathname();


  return (
    <div className='w-[226px] bg-[#A78BFA] h-screen pl-[25px] pt-[40px] fixed top-0 left-0'>
        <Link href={'/about'}>
        <header className='font-poppin font-semibold text-[42px]'>Logo</header>
        </Link>
        <ul className='space-y-5 pt-4'>
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
                courses.map((course, index) => (
                    
                        <li key={index}>
                            <Link href={`/courseDetails/${index+1}`}>
                            <p className={`text-[22px] font-sora ${pathname === `/courseDetails/${index+1}` ? "text-[#3308B2]" : "text-[#7244FB]"} font-medium`}>{course}</p>
                            </Link>
                        </li>
                ))
            }
            
        </ul>
    </div>
  )
}

export default Nav
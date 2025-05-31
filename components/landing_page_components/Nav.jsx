"use client";

import Link from 'next/link'
import React from 'react'
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';

const Nav = () => {
  return (
    <div className='flex px-[120px] 2xl:px-[200px] justify-between items-center pt-[36px]'>
      <div className='flex items-center'>
        <Image src={"/favicon.png"} height={80} width={80} alt='icon'/>
        <p className='font-semibold text-[32px] flex'>Nuero <p className='text-[#6F00FF]'>Note</p></p>
      </div>

      <div className='flex items-center justify-between gap-[31px]'>
        <p className='text-[22px] font-poppins cursor-pointer'>Download App</p>
        <p className='text-[22px] font-poppins cursor-pointer'>Learn More</p>

        <Link href={ROUTES.SIGN_UP}>
        <div className='flex justify-center items-center cursor-pointer hover:bg-[#9597F3] bg-[#6366F1] rounded-[8px] px-[20px] py-[10px]'>
          <p className='text-white text-[22px] font-poppins font-semibold'>Start Learning Smarter</p>
        </div>
        </Link>


      </div>
    </div>
  )
}

export default Nav   
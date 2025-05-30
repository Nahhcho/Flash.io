import Link from 'next/link'
import React from 'react'
import { signIn } from "@/auth"

const Nav = () => {
  return (
    <div className='flex px-[120px] 2xl:px-[200px] justify-between items-center pt-[36px]'>
      <div>
        <p className='font-semibold text-[32px]'>Flash.io</p>
      </div>

      <div className='flex items-center justify-between gap-[31px]'>
        <p className='text-[22px] font-poppins cursor-pointer'>Download App</p>
        <p className='text-[22px] font-poppins cursor-pointer'>Learn More</p>

        <div onClick={async () => {
          "use server"
          await signIn("google");
        }} className='flex justify-center items-center cursor-pointer hover:bg-[#9597F3] bg-[#6366F1] rounded-[8px] px-[20px] py-[10px]'>
          <p className='text-white text-[22px] font-poppins font-semibold'>Start Learning Smarter</p>
        </div>


      </div>
    </div>
  )
}

export default Nav   
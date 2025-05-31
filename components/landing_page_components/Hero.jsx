import { signIn } from '@/auth'
import { ROUTES } from '@/constants/routes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    
    <div className='grid grid-cols-12 mx-[120px] 2xl:mx-[200px] gap-[20px] relative mt-[61px]'>
      
      <div className='flex flex-col col-start-1 col-end-7 pt-[70px] lg:pt-[90px] xl:pt-[180px]'>

        <div className='flex flex-col'>
          <header className='font-poppin font-semibold text-[54px] xl:text-[64px] 2xl:text-[72px] max-w-[600px] leading-[102.6%]'>Study Like It's All Mapped Out — Because It Is</header>
          <p className='max-w-[600px] mt-[10px] text-[#414141] leading-[123%] text-[22px] xl:text-[24px] 2xl:text-[28px]'>
            Create flashcards from slides, PDFs, or notes, 
            and get a daily routine that keeps you ready for every test.
          </p>
        </div>

        <Link href={ROUTES.SIGN_UP}>
        <div className='flex justify-center items-center rounded-[8px] cursor-pointer hover:bg-[#9597F3] bg-[#6366F1] max-w-[360px] h-[60px] xl:h-[80px] mt-[60px]'>
          <p className='font-poppin font-semibold text-[22px] xl:text-[28px] text-white'>Start Learning Smarter</p>
        </div>
        </Link>
 
      </div>

        <div className='col-start-7 col-end-13 relative w-[600px] xl:w-[750px] 2xl:h-[900px] 2xl:w-[900px] '>
          <Image src={"/hero_pic1.png"} alt='hero' width={900} height={900}/>
        </div>
    </div>
  )
}

export default Hero
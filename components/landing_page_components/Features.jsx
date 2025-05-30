import Image from 'next/image'
import React from 'react'

const Features = () => {
  return (
    <div className='bg-[#F0EFFF] mt-[10px] py-[80px] lg:px-[100px] px-[120px] 2xl:px-[200px]'>
        <div className='flex justify-center'>
            <header className='font-poppin font-semibold text-[48px]'>
                The Smart Way to Learn
            </header>
        </div>

        <div className='flex flex-col items-center pt-[52px] gap-[60px] lg:gap-[30px]'>

            <div className='flex w-full items-center flex-col lg:flex-row gap-8 lg:gap-20 lg:justify-between'>
                
                <div className='min-w-[425px]'>
                    <Image src={'/feature1.png'} width={550} height={500} alt='brain'/>
                </div>

                <div className='flex flex-col gap-[20px] xl:gap-[45px] max-w-[600px] justify-center items-center lg:items-start'>

                    <div className='flex flex-col text-center lg:text-left'>
                        <header className='font-poppin font-semibold text-[28px] xl:text-[32px]'>Instant Flashcard Creation</header>
                        <p className='font-poppin text-[20px] xl:text-[24px] leading-[142.6%]'>Turn your slides, textbook PDFs, and notes into flashcards with one upload. No manual typing — just smart, auto-generated cards ready to review.</p>
                    </div>
                    
                    <div className='flex rounded-[8px] w-[204px] h-[40px] xl:h-[54px] bg-[#CC42E2] hover:bg-[#DC7DEC] cursor-pointer justify-center items-center'>
                        <p className='text-white font-poppin font-semibold text-[20px] xl:text-[24px]'>Create</p>
                    </div>

                </div>
            </div>

            <div className='hidden lg:w-full lg:flex flex-col lg:flex-row gap-8 lg:gap-20 lg:justify-between'>

                <div className='flex flex-col gap-[20px] xl:gap-[45px] max-w-[600px] justify-center items-end text-right'>

                    <div className='flex flex-col'>
                        <header className='font-poppin font-semibold text-[24px] xl:text-[32px]'>Powered by Active Recall</header>
                        <p className='font-poppin text-[18px] xl:text-[24px] leading-[142.6%]'>Built on proven learning science, every flashcard and quiz is designed to help you actually remember what you study.</p>
                    </div>
                    
                    <div className='flex rounded-[8px] w-[204px] h-[40px] xl:h-[54px] hover:bg-[#87E2A1] cursor-pointer bg-[#3BD065] justify-center items-center'>
                        <p className='text-white font-poppin font-semibold text-[20px] xl:text-[24px]'>Recall</p>
                    </div>

                </div>
                
                <div className='min-w-[425px]'>
                    <Image src={'/feature2.png'} width={550} height={500} alt='thinker'/>
                </div>
            </div>

            <div className='lg:hidden flex flex-col items-center lg:flex-row gap-8 lg:gap-20 lg:justify-between'>
                
                <div className='min-w-[425px]'>
                    <Image src={'/feature2.png'} width={550} height={500} alt='thinker'/>
                </div>

                <div className='flex flex-col gap-[20px] xl:gap-[45px] max-w-[600px] justify-center items-center lg:items-start'>

                    <div className='flex flex-col text-center lg:text-left'>
                        <header className='font-poppin font-semibold text-[28px] xl:text-[32px]'>Powered by Active Recall</header>
                        <p className='font-poppin text-[20px] xl:text-[24px] leading-[142.6%]'>Built on proven learning science, every flashcard and quiz is designed to help you actually remember what you study.</p>
                    </div>
                    
                    <div className='flex rounded-[8px] w-[204px] h-[40px] xl:h-[54px] hover:bg-[#87E2A1] cursor-pointer bg-[#3BD065] justify-center items-center'>
                        <p className='text-white font-poppin font-semibold text-[20px] xl:text-[24px]'>Recall</p>
                    </div>

                </div>
            </div>



            <div className='flex flex-col w-full items-center lg:flex-row gap-8 lg:gap-20 lg:justify-between pt-[10px]'>
                
                <div className='min-w-[425px]'>
                    <Image src={'/feature3.png'} width={550} height={500} alt='planner'/>
                </div>

                <div className='flex flex-col gap-[20px] xl:gap-[45px] max-w-[600px] justify-center text-center items-center lg:items-start lg:text-left'>

                    <div className='flex flex-col'>
                        <header className='font-poppin font-semibold text-[28px] xl:text-[32px]'>Personalized Study Schedules</header>
                        <p className='font-poppin text-[20px] xl:text-[24px] leading-[142.6%]'>Input your quiz or exam dates and get a daily study plan that keeps you on track — no guesswork required.</p>
                    </div>
                    
                    <div className='flex rounded-[8px] w-[204px] h-[40px] xl:h-[54px] hover:bg-[#628DEE] cursor-pointer bg-[#346CEA] justify-center items-center'>
                        <p className='text-white font-poppin font-semibold text-[20px] xl:text-[24px]'>Plan</p>
                    </div>

                </div>
            </div>

        </div>

    </div>
  )
}

export default Features